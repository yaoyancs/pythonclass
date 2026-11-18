import { useState } from 'react';
import china from '../../analytics/chinaProvinces.json';
import { CITY_COORDS } from '../../analytics/cityCoords';
import type { OverviewCity, OverviewProvince } from '../../analytics/types';

type Ring = number[][];
type Geom =
  | { type: 'Polygon'; coordinates: Ring[] }
  | { type: 'MultiPolygon'; coordinates: Ring[][] };

interface ProvinceFeature {
  properties: { name: string };
  geometry: Geom;
}

const features = (china as { features: ProvinceFeature[] }).features;

function polygonsOf(geom: Geom): Ring[][] {
  if (geom.type === 'Polygon') return [geom.coordinates];
  return geom.coordinates;
}

const SOUTH_LAT = 17.5;

function ringIsSouth(ring: Ring): boolean {
  if (ring.length === 0) return false;
  let south = 0;
  for (const [, lat] of ring) if ((lat ?? 90) < SOUTH_LAT) south += 1;
  return south / ring.length > 0.5;
}

function splitRings(geom: Geom): { main: Ring[][]; south: Ring[][] } {
  const main: Ring[][] = [];
  const south: Ring[][] = [];
  for (const polygon of polygonsOf(geom)) {
    const mainRings = polygon.filter((ring) => !ringIsSouth(ring));
    const southRings = polygon.filter(ringIsSouth);
    if (mainRings.length > 0) main.push(mainRings);
    if (southRings.length > 0) south.push(southRings);
  }
  return { main, south };
}

const mainland = features
  .map((feature) => ({ ...feature, rings: splitRings(feature.geometry).main }))
  .filter((feature) => feature.rings.length > 0);
const southSea = features.flatMap((feature) => splitRings(feature.geometry).south);

function mercator(lng: number, lat: number): [number, number] {
  const clamped = Math.max(-85, Math.min(85, lat));
  const rad = (clamped * Math.PI) / 180;
  return [(lng * Math.PI) / 180, Math.log(Math.tan(Math.PI / 4 + rad / 2))];
}

function boundsOf(groups: Ring[][]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const polygon of groups) {
    for (const ring of polygon) {
      for (const [lng, lat] of ring) {
        if (lng == null || lat == null || lat < SOUTH_LAT) continue;
        const [x, y] = mercator(lng, lat);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return { minX, maxX, minY, maxY };
}

function southBoundsOf(groups: Ring[][]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const polygon of groups) {
    for (const ring of polygon) {
      for (const [lng, lat] of ring) {
        if (lng == null || lat == null) continue;
        const [x, y] = mercator(lng, lat);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return { minX, maxX, minY, maxY };
}

const mainlandBounds = boundsOf(mainland.flatMap((feature) => feature.rings));
const southBounds = southBoundsOf(southSea);

function makeProject(
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  frame: { x: number; y: number; width: number; height: number },
) {
  const pad = 8;
  const innerW = frame.width - pad * 2;
  const innerH = frame.height - pad * 2;
  const scale = Math.min(innerW / (bounds.maxX - bounds.minX), innerH / (bounds.maxY - bounds.minY));
  const usedW = (bounds.maxX - bounds.minX) * scale;
  const usedH = (bounds.maxY - bounds.minY) * scale;
  const ox = frame.x + (frame.width - usedW) / 2;
  const oy = frame.y + (frame.height - usedH) / 2;
  return (lng: number, lat: number): [number, number] => {
    const [x, y] = mercator(lng, lat);
    return [ox + (x - bounds.minX) * scale, oy + (bounds.maxY - y) * scale];
  };
}

function pathOf(polygons: Ring[][], project: (lng: number, lat: number) => [number, number]): string {
  return polygons
    .map((polygon) =>
      polygon
        .map((ring) =>
          ring
            .map(([lng, lat], index) => {
              const [x, y] = project(lng!, lat!);
              return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ') + 'Z',
        )
        .join(' '),
    )
    .join(' ');
}

export type MapMetric = 'total' | 'last7';

interface VisitMapProps {
  cities: OverviewCity[];
  provinces?: OverviewProvince[];
  metric: MapMetric;
}

export function VisitMap({ cities, provinces = [], metric }: VisitMapProps) {
  const width = 640;
  const height = 520;
  const [cam, setCam] = useState({ k: 1, x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const projectMain = makeProject(mainlandBounds, { x: 0, y: 0, width, height: height - 8 });
  const inset = { x: 500, y: 390, width: 124, height: 116 };
  const projectSouth = Number.isFinite(southBounds.minX)
    ? makeProject(southBounds, { x: inset.x + 6, y: inset.y + 18, width: inset.width - 12, height: inset.height - 26 })
    : null;

  const provMap = new Map<string, OverviewProvince>();
  for (const prov of provinces) {
    provMap.set(prov.name, prov);
  }
  const maxProv = Math.max(
    1,
    ...provinces.map((p) => (metric === 'last7' ? p.last7 : p.total)),
  );

  const placed = new Map<string, { name: string; total: number; last7: number; lng: number; lat: number }>();
  let unplaced = 0;
  let provinceOnlyPlaced = 0;
  for (const city of cities) {
    const count = metric === 'last7' ? city.last7 : city.total;
    const coord = city.name ? CITY_COORDS[city.name] : undefined;
    if (!city.name || !coord) {
      if (city.key && city.key !== '未知地区' && provMap.has(city.key)) {
        provinceOnlyPlaced += count;
      } else {
        unplaced += count;
      }
      continue;
    }
    const prev = placed.get(city.name);
    if (prev) {
      prev.total += city.total;
      prev.last7 += city.last7;
    } else {
      placed.set(city.name, {
        name: city.name,
        total: city.total,
        last7: city.last7,
        lng: coord[0],
        lat: coord[1],
      });
    }
  }
  const dots = [...placed.values()].filter((dot) => (metric === 'last7' ? dot.last7 : dot.total) > 0);
  const max = Math.max(1, ...dots.map((dot) => (metric === 'last7' ? dot.last7 : dot.total)));
  const labeled = new Set(
    [...dots]
      .sort((a, b) => (metric === 'last7' ? b.last7 - a.last7 : b.total - a.total))
      .slice(0, 8)
      .map((dot) => dot.name),
  );

  const zoom = (factor: number) =>
    setCam((current) => ({ ...current, k: Math.min(6, Math.max(1, current.k * factor)) }));

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-lg border border-classroom-border px-3 py-1" onClick={() => zoom(1.25)}>
            放大
          </button>
          <button type="button" className="rounded-lg border border-classroom-border px-3 py-1" onClick={() => zoom(0.8)}>
            缩小
          </button>
          <button type="button" className="rounded-lg border border-classroom-border px-3 py-1" onClick={() => setCam({ k: 1, x: 0, y: 0 })}>
            还原
          </button>
          <span className="text-text-secondary">滚轮缩放，拖动平移</span>
        </div>
        {hoverText && (
          <span className="rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
            {hoverText}
          </span>
        )}
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto touch-none cursor-grab"
        role="img"
        aria-label="访问城市与省份分布"
        onMouseLeave={() => setHoverText(null)}
        onWheel={(event) => {
          event.preventDefault();
          zoom(event.deltaY < 0 ? 1.12 : 0.9);
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag({ x: event.clientX, y: event.clientY });
        }}
        onPointerMove={(event) => {
          if (!drag) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const dx = ((event.clientX - drag.x) / rect.width) * width;
          const dy = ((event.clientY - drag.y) / rect.height) * height;
          setDrag({ x: event.clientX, y: event.clientY });
          setCam((current) => ({ ...current, x: current.x + dx, y: current.y + dy }));
        }}
        onPointerUp={() => setDrag(null)}
      >
        <rect width={width} height={height} rx={16} className="fill-classroom-playground" />
        <clipPath id="visit-map-clip">
          <rect width={width} height={height} rx={16} />
        </clipPath>
        <g clipPath="url(#visit-map-clip)">
          <g transform={`translate(${width / 2 + cam.x} ${height / 2 + cam.y}) scale(${cam.k}) translate(${-width / 2} ${-height / 2})`}>
            {mainland.map((feature, index) => {
              const prov = provMap.get(feature.properties.name);
              const provVal = prov ? (metric === 'last7' ? prov.last7 : prov.total) : 0;
              const fillOpacity = provVal > 0 ? 0.16 + 0.36 * Math.sqrt(provVal / maxProv) : 0.08;
              const label = prov
                ? `${feature.properties.name} · 累计 ${prov.total} · 近 7 天 ${prov.last7}`
                : feature.properties.name;
              return (
                <path
                  key={`${feature.properties.name}-${index}`}
                  d={pathOf(feature.rings, projectMain)}
                  fillRule="evenodd"
                  className="fill-accent stroke-classroom-border transition-opacity"
                  fillOpacity={fillOpacity}
                  strokeWidth={0.6}
                  onMouseEnter={() => setHoverText(label)}
                >
                  <title>{label}</title>
                </path>
              );
            })}
            {dots.map((dot) => {
              const count = metric === 'last7' ? dot.last7 : dot.total;
              const [x, y] = projectMain(dot.lng, dot.lat);
              const r = 4.5 + 15 * Math.sqrt(count / max);
              const recent = dot.last7 > 0;
              const tip = `${dot.name} · 累计 ${dot.total} · 近 7 天 ${dot.last7}`;
              return (
                <g key={dot.name} onMouseEnter={() => setHoverText(tip)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    className={
                      recent
                        ? 'fill-accent/85 stroke-classroom-playground'
                        : 'fill-text-secondary/55 stroke-classroom-playground'
                    }
                    strokeWidth={1}
                  >
                    <title>{tip}</title>
                  </circle>
                  {labeled.has(dot.name) && (
                    <text x={x + r + 2} y={y + 4} className="fill-text-primary pointer-events-none" fontSize={12}>
                      {dot.name} {count}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </g>
        <rect
          x={inset.x}
          y={inset.y}
          width={inset.width}
          height={inset.height}
          rx={8}
          className="fill-classroom-playground stroke-classroom-border"
        />
        {projectSouth &&
          southSea.map((rings, index) => (
            <path
              key={`south-${index}`}
              d={pathOf([rings], projectSouth)}
              fillRule="evenodd"
              className="fill-accent/15 stroke-classroom-border"
              strokeWidth={0.6}
            />
          ))}
        <text x={inset.x + 8} y={inset.y + 14} className="fill-text-secondary" fontSize={11}>
          南海诸岛
        </text>
      </svg>
      <p className="text-xs text-text-secondary mt-2">
        省份底色深浅反映省级会话热力，圆点面积表示地市{metric === 'last7' ? '近 7 天' : '累计'}会话数（强调色表示近 7 天仍有访问）。
        {provinceOnlyPlaced > 0 ? ` 仅识别到省级的 ${provinceOnlyPlaced} 个会话已计入对应省份热力底色。` : ''}
        {unplaced > 0 ? ` 另有 ${unplaced} 个未知或境外会话未在境内地图落点。` : ''}
      </p>
    </div>
  );
}
