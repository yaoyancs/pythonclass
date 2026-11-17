import china from '../../analytics/chinaProvinces.json';
import { CITY_COORDS } from '../../analytics/cityCoords';
import type { OverviewCity } from '../../analytics/types';

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

function walkPoints(geom: Geom, visit: (lng: number, lat: number) => void) {
  for (const polygon of polygonsOf(geom)) {
    for (const ring of polygon) {
      for (const [lng, lat] of ring) visit(lng!, lat!);
    }
  }
}

function isSouthSea(feature: ProvinceFeature): boolean {
  let south = 0;
  let total = 0;
  walkPoints(feature.geometry, (_lng, lat) => {
    total += 1;
    if (lat < 18) south += 1;
  });
  return total > 0 && south / total > 0.4;
}

const mainland = features.filter((feature) => !isSouthSea(feature));
const southSea = features.filter(isSouthSea);

function mercator(lng: number, lat: number): [number, number] {
  const clamped = Math.max(-85, Math.min(85, lat));
  const rad = (clamped * Math.PI) / 180;
  return [lng, Math.log(Math.tan(Math.PI / 4 + rad / 2))];
}

function boundsOf(list: ProvinceFeature[]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const feature of list) {
    walkPoints(feature.geometry, (lng, lat) => {
      const [x, y] = mercator(lng, lat);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
  }
  return { minX, maxX, minY, maxY };
}

const mainlandBounds = boundsOf(mainland);
const southBounds = boundsOf(southSea);

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

function pathOf(geom: Geom, project: (lng: number, lat: number) => [number, number]): string {
  return polygonsOf(geom)
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
  metric: MapMetric;
}

export function VisitMap({ cities, metric }: VisitMapProps) {
  const width = 640;
  const height = 520;
  const projectMain = makeProject(mainlandBounds, { x: 0, y: 0, width, height: height - 8 });
  const inset = { x: 500, y: 390, width: 124, height: 116 };
  const projectSouth = makeProject(southBounds, inset);

  const placed = new Map<string, { name: string; total: number; last7: number; lng: number; lat: number }>();
  let unplaced = 0;
  for (const city of cities) {
    const count = metric === 'last7' ? city.last7 : city.total;
    const coord = city.name ? CITY_COORDS[city.name] : undefined;
    if (!city.name || !coord) {
      unplaced += count;
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

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="访问城市分布">
        <rect width={width} height={height} rx={16} className="fill-classroom-playground" />
        {mainland.map((feature) => (
          <path
            key={feature.properties.name}
            d={pathOf(feature.geometry, projectMain)}
            fillRule="evenodd"
            className="fill-accent/15 stroke-classroom-border"
            strokeWidth={0.6}
          >
            <title>{feature.properties.name}</title>
          </path>
        ))}
        <rect
          x={inset.x}
          y={inset.y}
          width={inset.width}
          height={inset.height}
          rx={8}
          className="fill-classroom-playground stroke-classroom-border"
        />
        {southSea.map((feature, index) => (
          <path
            key={`south-${index}`}
            d={pathOf(feature.geometry, projectSouth)}
            fillRule="evenodd"
            className="fill-accent/15 stroke-classroom-border"
            strokeWidth={0.6}
          />
        ))}
        <text x={inset.x + 8} y={inset.y + 16} className="fill-text-secondary" fontSize={11}>
          南海诸岛
        </text>
        {dots.map((dot) => {
          const count = metric === 'last7' ? dot.last7 : dot.total;
          const [x, y] = projectMain(dot.lng, dot.lat);
          const r = 5 + 16 * Math.sqrt(count / max);
          const recent = dot.last7 > 0;
          return (
            <g key={dot.name}>
              <circle cx={x} cy={y} r={r} className={recent ? 'fill-accent/80' : 'fill-text-secondary/50'}>
                <title>{`${dot.name} · 累计 ${dot.total} · 近 7 天 ${dot.last7}`}</title>
              </circle>
              {labeled.has(dot.name) && (
                <text x={x + r + 2} y={y + 4} className="fill-text-primary" fontSize={12}>
                  {dot.name} {count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-text-secondary mt-2">
        底图为省级边界。圆的面积是{metric === 'last7' ? '近 7 天' : '累计'}会话数。强调色表示近 7 天仍有访问。
        {unplaced > 0 ? ` 另有 ${unplaced} 个会话没有可标注的市（未知、只有省，或境外）。` : ''}
      </p>
    </div>
  );
}
