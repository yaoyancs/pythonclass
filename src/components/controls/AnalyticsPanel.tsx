import { fetchAnalyticsOverview, fetchAnalyticsSummary, fetchLessonHeat } from '../../api/analyticsApi';
import type { LessonHeat, OverviewCity, OverviewDay, OverviewResult, SummaryResult } from '../../analytics/types';
import { TeacherApiError, loadTeacherToken } from '../../api/teacherApi';
import { shanghaiDateInputValue } from '../../analytics/dates';
import { Button } from '../ui/Button';
import { TeacherPanel } from './TeacherPanel';
import { VisitMap, type MapMetric } from './VisitMap';
import { useEffect, useState } from 'react';

interface AnalyticsPanelProps {
  onClose: () => void;
}

export function AnalyticsPanel({ onClose }: AnalyticsPanelProps) {
  const [date, setDate] = useState(() => shanghaiDateInputValue());
  const [includeTeacher, setIncludeTeacher] = useState(false);
  const [overviewBusy, setOverviewBusy] = useState(false);
  const [dayBusy, setDayBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [overview, setOverview] = useState<OverviewResult | null>(null);
  const [lessons, setLessons] = useState<LessonHeat[]>([]);
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [mapMetric, setMapMetric] = useState<MapMetric>('total');

  useEffect(() => {
    const token = loadTeacherToken();
    if (!token) {
      setError('未登录教师台');
      return;
    }
    let cancelled = false;
    setOverviewBusy(true);
    void fetchAnalyticsOverview(token, includeTeacher)
      .then((data) => {
        if (!cancelled) setOverview(data);
      })
      .catch((err) => {
        if (!cancelled) setError(messageOf(err));
      })
      .finally(() => {
        if (!cancelled) setOverviewBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [includeTeacher]);

  useEffect(() => {
    const token = loadTeacherToken();
    if (!token) {
      setError('未登录教师台');
      return;
    }
    let cancelled = false;
    setDayBusy(true);
    void Promise.all([
      fetchAnalyticsSummary(token, date, includeTeacher),
      fetchLessonHeat(token, date, includeTeacher),
    ])
      .then(([sum, heat]) => {
        if (cancelled) return;
        setSummary(sum);
        setLessons(heat.lessons);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(messageOf(err));
      })
      .finally(() => {
        if (!cancelled) setDayBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, includeTeacher]);

  const maxHour = Math.max(1, ...(summary?.timeline.map((t) => t.count) ?? [1]));

  return (
    <TeacherPanel title="访问统计" onClose={onClose} wide initialWidth={860} initialHeight={720}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-sm text-text-secondary flex items-center gap-2">
          日期
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-classroom-border bg-classroom-playground px-3 py-1.5 text-text-primary"
          />
        </label>
        <label className="text-sm text-text-secondary flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeTeacher}
            onChange={(e) => setIncludeTeacher(e.target.checked)}
          />
          含教师演示
        </label>
        {(overviewBusy || dayBusy) && <span className="text-sm text-text-secondary">载入中…</span>}
      </div>
      {error && <p className="text-error text-sm mb-3">{error}</p>}
      {overview && (
        <section className="mb-6">
          <p className="text-sm text-text-secondary mb-3">{overview.note}</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <TotalsColumn title="累计" sessionsLabel={overview.excludeTeacher ? '学生会话' : '会话'} totals={overview.totals} />
            <TotalsColumn title="近 7 天" sessionsLabel={overview.excludeTeacher ? '学生会话' : '会话'} totals={overview.last7} />
          </div>
          <h3 className="text-base font-semibold mb-2">近 7 天</h3>
          <WeekLines days={overview.days} />
          <div className="flex items-center gap-2 mt-5 mb-2">
            <h3 className="text-base font-semibold">城市</h3>
            <Button type="button" variant={mapMetric === 'total' ? 'primary' : 'ghost'} size="sm" onClick={() => setMapMetric('total')}>
              累计
            </Button>
            <Button type="button" variant={mapMetric === 'last7' ? 'primary' : 'ghost'} size="sm" onClick={() => setMapMetric('last7')}>
              近 7 天
            </Button>
          </div>
          <VisitMap cities={overview.cities} metric={mapMetric} />
          <CityBars cities={overview.cities} />
          <CityTable cities={overview.cities} />
        </section>
      )}
      {summary && (
        <>
          <h3 className="text-base font-semibold mb-2">所选日期</h3>
          <p className="text-sm text-text-secondary mb-4">{summary.note}</p>
          {summary.emptyStudents && (
            <p className="text-sm rounded-2xl border border-accent/40 bg-accent/5 px-4 py-3 mb-4">
              去掉教师演示后暂无学生访问。课上投影不会记入学情；看「课后作业打开数」是否有人从封面点进来。
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <div className="rounded-2xl border border-classroom-border px-4 py-3">
              <p className="text-sm text-text-secondary">课后作业打开</p>
              <p className="text-3xl title-stage text-text-primary mt-1">{summary.homeworkOpens}</p>
            </div>
            <div className="rounded-2xl border border-classroom-border px-4 py-3">
              <p className="text-sm text-text-secondary">学生会话</p>
              <p className="text-3xl title-stage text-text-primary mt-1">{summary.studentUv}</p>
            </div>
            <div className="rounded-2xl border border-classroom-border px-4 py-3">
              <p className="text-sm text-text-secondary">教师演示</p>
              <p className="text-3xl title-stage text-text-primary mt-1">{summary.teacherUv}</p>
            </div>
            <div className="rounded-2xl border border-classroom-border px-4 py-3">
              <p className="text-sm text-text-secondary">浏览次数</p>
              <p className="text-3xl title-stage text-text-primary mt-1">{summary.pv}</p>
            </div>
          </div>

          <section className="mb-5">
            <h3 className="text-base font-semibold mb-2">按小时（北京时间）</h3>
            <div className="flex items-end gap-0.5 h-24">
              {summary.timeline.map((row) => (
                <div
                  key={row.hour}
                  className="flex-1 bg-accent/70 rounded-t min-h-[2px]"
                  style={{ height: `${Math.max(4, (row.count / maxHour) * 100)}%` }}
                  title={`${row.hour} 时 ${row.count} 次`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>0</span>
              <span>12</span>
              <span>23</span>
            </div>
          </section>

          <section className="mb-5">
            <h3 className="text-base font-semibold mb-2">地区</h3>
            <ul className="text-sm space-y-1">
              {(summary.byRegion ?? []).length === 0 && <li className="text-text-secondary">暂无</li>}
              {(summary.byRegion ?? []).map((row) => (
                <li key={row.key} className="flex justify-between gap-2">
                  <span>{row.key}</span>
                  <span className="tabular-nums">{row.count}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-text-secondary mt-2">按独立会话计。位置来自访问边缘节点，精确到市；更早的记录没有地区。</p>
          </section>

          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <section>
              <h3 className="text-base font-semibold mb-2">来源</h3>
              <ul className="text-sm space-y-1">
                {summary.byReferrer.length === 0 && (
                  <li className="text-text-secondary">暂无</li>
                )}
                {summary.byReferrer.map((row) => (
                  <li key={row.key} className="flex justify-between gap-2">
                    <span className="truncate">{row.key}</span>
                    <span className="tabular-nums">{row.count}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-base font-semibold mb-2">设备</h3>
              <ul className="text-sm space-y-1">
                {summary.byDevice.map((row) => (
                  <li key={row.key} className="flex justify-between gap-2">
                    <span>{row.key}</span>
                    <span className="tabular-nums">{row.count}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <details className="mb-5">
            <summary className="text-base font-semibold cursor-pointer">最近访问（最多 50 条）</summary>
            <p className="text-xs text-text-secondary mb-2 mt-2">IP 仅供参考，校园网 NAT 下会重复。</p>
            <div className="overflow-x-auto rounded-xl border border-classroom-border">
              <table className="w-full text-sm">
                <thead className="bg-classroom-playground text-text-secondary">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">时间</th>
                    <th className="text-left px-3 py-2 font-medium">地区</th>
                    <th className="text-left px-3 py-2 font-medium">IP</th>
                    <th className="text-left px-3 py-2 font-medium">设备</th>
                    <th className="text-left px-3 py-2 font-medium">来源</th>
                    <th className="text-left px-3 py-2 font-medium">页面</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recent.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-text-secondary">
                        当天暂无记录
                      </td>
                    </tr>
                  )}
                  {summary.recent.map((row, i) => (
                    <tr key={`${row.ts}-${i}`} className="border-t border-classroom-border/60">
                      <td className="px-3 py-2 whitespace-nowrap">{row.tsLocal}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.region || '—'}</td>
                      <td className="px-3 py-2 font-mono text-xs">{row.ip}</td>
                      <td className="px-3 py-2">{row.device}</td>
                      <td className="px-3 py-2 max-w-[10rem] truncate">{row.referrer || '—'}</td>
                      <td className="px-3 py-2">
                        {row.lessonId
                          ? `${row.lessonId}${row.sceneIndex != null ? ` #${row.sceneIndex}` : ''}`
                          : row.path || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <section>
            <h3 className="text-base font-semibold mb-2">各讲热度</h3>
            {lessons.length === 0 && <p className="text-sm text-text-secondary">当天还没有课堂浏览</p>}
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li key={lesson.lessonId} className="rounded-2xl border border-classroom-border px-4 py-3">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <Button
                      variant="ghost"
                      size="md"
                      type="button"
                      onClick={() =>
                        setOpenLesson((id) => (id === lesson.lessonId ? null : lesson.lessonId))
                      }
                    >
                      {lesson.lessonId}
                    </Button>
                    <span className="text-sm text-text-secondary">
                      作业 {lesson.homeworkOpens} · 浏览 {lesson.views} · 会话 {lesson.sessions} · 看完{' '}
                      {lesson.completions} · 运行 {lesson.runs}（成功 {lesson.runOk} / 报错 {lesson.runError}，改过{' '}
                      {lesson.codeChanged} / 未改 {lesson.codeSame}）· 选择 {lesson.choicesCorrect}/{lesson.choices}
                      （一次对 {lesson.firstTryCorrect}）· 首次运行 {lesson.avgFirstRunSeconds}s · 平均停留{' '}
                      {lesson.avgDwellSeconds}s
                    </span>
                  </div>
                  {openLesson === lesson.lessonId && (
                    <div className="mt-2 pl-2">
                      {lesson.errorTypes.length > 0 && (
                        <p className="text-sm text-text-secondary mb-2">
                          异常：{lesson.errorTypes.map((row) => `${row.key} ${row.count}`).join(' · ')}
                        </p>
                      )}
                    <ul className="text-sm space-y-1">
                      {lesson.scenes.map((scene) => (
                        <li key={scene.sceneIndex} className="flex justify-between gap-2">
                          <span>
                            第 {scene.sceneIndex + 1} 幕
                            {scene.partId ? ` · ${scene.partId}` : ''}
                          </span>
                          <span className="text-text-secondary tabular-nums">
                            浏览 {scene.views} · 停留 {scene.avgDwellSeconds}s · 运行 {scene.runs}（成功 {scene.runOk} / 报错{' '}
                            {scene.runError}）· 选择 {scene.choicesCorrect}/{scene.choices}
                          </span>
                        </li>
                      ))}
                    </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </TeacherPanel>
  );
}

function messageOf(err: unknown): string {
  if (err instanceof TeacherApiError) return err.message;
  if (err instanceof Error) return err.message;
  return '读取失败';
}

function TotalsColumn({
  title,
  sessionsLabel,
  totals,
}: {
  title: string;
  sessionsLabel: string;
  totals: OverviewResult['totals'];
}) {
  const rows = [
    [sessionsLabel, totals.sessions],
    ['浏览次数', totals.pv],
    ['作业打开', totals.homeworkOpens],
    ['城市', totals.cities],
  ] as const;
  return (
    <div className="rounded-2xl border border-classroom-border px-4 py-3">
      <p className="text-sm font-semibold mb-2">{title}</p>
      <ul className="space-y-1">
        {rows.map(([label, value]) => (
          <li key={label} className="flex justify-between gap-2 text-sm">
            <span className="text-text-secondary">{label}</span>
            <span className="tabular-nums text-lg title-stage">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WeekLines({ days }: { days: OverviewDay[] }) {
  const width = 640;
  const height = 168;
  const left = 36;
  const right = 36;
  const top = 16;
  const bottom = 28;
  const innerW = width - left - right;
  const innerH = height - top - bottom;
  const maxPv = Math.max(1, ...days.map((day) => day.pv));
  const maxSessions = Math.max(1, ...days.map((day) => Math.max(day.sessions, day.homeworkOpens)));
  const xAt = (index: number) => left + (days.length <= 1 ? innerW / 2 : (index / (days.length - 1)) * innerW);
  const yPv = (value: number) => top + innerH - (value / maxPv) * innerH;
  const ySessions = (value: number) => top + innerH - (value / maxSessions) * innerH;
  const line = (values: number[], yAt: (value: number) => number) =>
    values.map((value, index) => `${index === 0 ? 'M' : 'L'}${xAt(index).toFixed(1)} ${yAt(value).toFixed(1)}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="近七日访问">
        <line x1={left} y1={top} x2={left} y2={top + innerH} className="stroke-classroom-border" />
        <line x1={width - right} y1={top} x2={width - right} y2={top + innerH} className="stroke-classroom-border" />
        <path d={line(days.map((day) => day.pv), yPv)} className="fill-none stroke-accent" strokeWidth={2} />
        <path d={line(days.map((day) => day.sessions), ySessions)} className="fill-none stroke-text-primary" strokeWidth={2} />
        <path
          d={line(days.map((day) => day.homeworkOpens), ySessions)}
          className="fill-none stroke-text-secondary"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        {days.map((day, index) => (
          <text key={day.date} x={xAt(index)} y={height - 8} textAnchor="middle" className="fill-text-secondary" fontSize={11}>
            {day.date.slice(5)}
          </text>
        ))}
        <text x={4} y={12} className="fill-accent" fontSize={11}>
          {maxPv}
        </text>
        <text x={width - 4} y={12} textAnchor="end" className="fill-text-primary" fontSize={11}>
          {maxSessions}
        </text>
      </svg>
      <p className="text-xs text-text-secondary">强调色为浏览次数（左轴），深色为会话，虚线为作业打开（右轴）。</p>
    </div>
  );
}

function CityBars({ cities }: { cities: OverviewCity[] }) {
  const ranked = cities.filter((city) => city.name);
  const top = ranked.slice(0, 8);
  const rest = ranked.slice(8);
  const rows: OverviewCity[] = [...top];
  if (rest.length > 0) {
    rows.push({
      key: '其他',
      name: '其他',
      total: rest.reduce((sum, city) => sum + city.total, 0),
      last7: rest.reduce((sum, city) => sum + city.last7, 0),
    });
  }
  const max = Math.max(1, ...rows.map((row) => row.total));
  if (rows.length === 0) return <p className="text-sm text-text-secondary mt-3">暂无城市</p>;
  return (
    <ul className="mt-4 space-y-2">
      {rows.map((row) => (
        <li key={row.key}>
          <div className="flex justify-between gap-2 text-sm mb-1">
            <span>{row.name}</span>
            <span className="tabular-nums text-text-secondary">
              累计 {row.total} · 近 7 天 {row.last7}
            </span>
          </div>
          <div className="h-2 rounded-full bg-classroom-playground">
            <div className="h-full rounded-full bg-accent/25" style={{ width: `${(row.total / max) * 100}%` }}>
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${row.total === 0 ? 0 : (Math.min(row.last7, row.total) / row.total) * 100}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CityTable({ cities }: { cities: OverviewCity[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-classroom-border mt-4">
      <table className="w-full text-sm">
        <thead className="bg-classroom-playground text-text-secondary">
          <tr>
            <th className="text-left px-3 py-2 font-medium">地区</th>
            <th className="text-right px-3 py-2 font-medium">累计会话</th>
            <th className="text-right px-3 py-2 font-medium">近 7 天</th>
          </tr>
        </thead>
        <tbody>
          {cities.length === 0 && (
            <tr>
              <td colSpan={3} className="px-3 py-4 text-text-secondary">
                暂无
              </td>
            </tr>
          )}
          {cities.map((row) => (
            <tr key={row.key} className="border-t border-classroom-border/60">
              <td className="px-3 py-2">{row.key}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.total}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.last7}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
