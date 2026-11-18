import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAnalyticsOverview, fetchAnalyticsSummary, fetchLessonHeat } from '../../api/analyticsApi';
import type {
  AnalyticsFilterRange,
  HitType,
  LessonHeat,
  LessonSceneHeat,
  OverviewCity,
  OverviewDay,
  OverviewResult,
  SummaryResult,
} from '../../analytics/types';
import { TeacherApiError, loadTeacherToken } from '../../api/teacherApi';
import { shanghaiDateInputValue } from '../../analytics/dates';
import { getLessonById } from '../../data/lessons';
import type { SceneType } from '../../types/scene';
import { downloadTextFile } from '../../utils/csv';
import { Button } from '../ui/Button';
import { TeacherPanel } from './TeacherPanel';
import { VisitMap, type MapMetric } from './VisitMap';

interface AnalyticsPanelProps {
  onClose: () => void;
}

type RangeMode = AnalyticsFilterRange['mode'];

function shiftDateYmd(ymd: string, deltaDays: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return ymd;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + deltaDays, 12, 0, 0));
  return shanghaiDateInputValue(d);
}

const SCENE_TYPE_LABEL: Record<SceneType, string> = {
  explain: '讲授',
  question: '提问',
  predict: '预测',
  run: '运行',
  modify: '改码',
  debug: '排错',
  challenge: '练习',
  aiReview: 'AI审查',
  summary: '小结',
  break: '课间',
};

const HIT_TYPE_LABEL: Record<HitType, string> = {
  session_start: '进入站点',
  lesson_view: '进入课堂',
  scene_view: '浏览教学幕',
  scene_dwell: '有效停留',
  run: '运行代码',
  run_result: '运行结果',
  choice: '互动答题',
  homework_open: '打开作业',
  lesson_complete: '读完尾幕',
  first_run: '首次运行',
  hint_view: '查看提示',
  ai_review: 'AI审查',
};

function formatLessonTitle(lessonId: string): string {
  const lesson = getLessonById(lessonId);
  if (!lesson) return lessonId;
  return lesson.subtitle || `第 ${lesson.number} 讲 · ${lesson.title}`;
}

function formatSceneLabel(lessonId: string, sceneIndex: number, fallbackPartId?: string | null): {
  title: string;
  kind: string | null;
} {
  const lesson = getLessonById(lessonId);
  const scene = lesson?.scenes[sceneIndex];
  if (!scene) {
    return {
      title: `第 ${sceneIndex + 1} 幕${fallbackPartId ? ` · ${fallbackPartId}` : ''}`,
      kind: null,
    };
  }
  return {
    title: `第 ${sceneIndex + 1} 幕 · ${scene.title}`,
    kind: SCENE_TYPE_LABEL[scene.type] ?? null,
  };
}

function csvCell(value: string | number | null | undefined): string {
  const s = value == null ? '' : String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows: Array<Array<string | number | null | undefined>>): string {
  return rows.map((row) => row.map(csvCell).join(',')).join('\n') + '\n';
}

export function AnalyticsPanel({ onClose }: AnalyticsPanelProps) {
  const navigate = useNavigate();
  const today = useMemo(() => shanghaiDateInputValue(), []);
  const [rangeMode, setRangeMode] = useState<RangeMode>('day');
  const [date, setDate] = useState(() => today);
  const [customStart, setCustomStart] = useState(() => shiftDateYmd(today, -6));
  const [customEnd, setCustomEnd] = useState(() => today);
  const [includeTeacher, setIncludeTeacher] = useState(false);
  const [overviewBusy, setOverviewBusy] = useState(false);
  const [dayBusy, setDayBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [overview, setOverview] = useState<OverviewResult | null>(null);
  const [lessons, setLessons] = useState<LessonHeat[]>([]);
  const [lessonsTruncated, setLessonsTruncated] = useState(false);
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [mapMetric, setMapMetric] = useState<MapMetric>('total');

  const activeFilter: AnalyticsFilterRange = useMemo(() => {
    if (rangeMode === 'day') return { mode: 'day', date };
    if (rangeMode === 'last7') return { mode: 'last7' };
    if (rangeMode === 'all') return { mode: 'all' };
    return { mode: 'custom', start: customStart, end: customEnd };
  }, [customEnd, customStart, date, rangeMode]);

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
    setError(null);
    void Promise.all([
      fetchAnalyticsSummary(token, activeFilter, includeTeacher),
      fetchLessonHeat(token, activeFilter, includeTeacher),
    ])
      .then(([sum, heat]) => {
        if (cancelled) return;
        setSummary(sum);
        setLessons(heat.lessons);
        setLessonsTruncated(Boolean(heat.truncated));
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
  }, [activeFilter, includeTeacher]);

  const maxHour = Math.max(1, ...(summary?.timeline.map((t) => t.count) ?? [1]));

  const jumpToClassroom = (lessonId: string, sceneIndex?: number | null) => {
    const suffix = sceneIndex != null && sceneIndex >= 0 ? `?scene=${sceneIndex}` : '';
    onClose();
    navigate(`/lesson/${lessonId}${suffix}`);
  };

  const handleExportOverviewCsv = () => {
    if (!overview && !summary) return;
    const rows: Array<Array<string | number | null | undefined>> = [];
    rows.push(['报表范围', summary?.date ?? today, includeTeacher ? '含教师演示' : '纯学生端（排除教师会话）']);
    rows.push([]);
    if (overview) {
      rows.push(['【全局指标】', '独立设备', '会话数', '浏览次数(PV)', '课后作业打开', '覆盖地市']);
      rows.push(['累计', overview.totals.visitors, overview.totals.sessions, overview.totals.pv, overview.totals.homeworkOpens, overview.totals.cities]);
      rows.push(['近7天', overview.last7.visitors, overview.last7.sessions, overview.last7.pv, overview.last7.homeworkOpens, overview.last7.cities]);
      rows.push([]);
      rows.push(['【近7天每日趋势】', '独立设备', '会话数', '浏览次数(PV)', '课后作业打开']);
      for (const day of overview.days) {
        rows.push([day.date, day.visitors, day.sessions, day.pv, day.homeworkOpens]);
      }
      rows.push([]);
      rows.push(['【访问地区分布】', '累计会话', '近7天会话']);
      for (const city of overview.cities) {
        rows.push([city.key, city.total, city.last7]);
      }
      rows.push([]);
    }
    if (summary) {
      rows.push(['【所选范围汇总】', summary.date]);
      rows.push(['独立设备', '学生会话', '教师会话', '浏览次数(PV)', '代码运行次数', '作业打开会话']);
      rows.push([summary.visitors, summary.studentUv, summary.teacherUv, summary.pv, summary.runs, summary.homeworkOpens]);
      rows.push([]);
      rows.push(['【北京时间小时分布】', '活跃事件数']);
      for (const t of summary.timeline) {
        rows.push([`${t.hour}:00`, t.count]);
      }
    }
    const tag = (summary?.date ?? today).replace(/\s+/g, '');
    downloadTextFile(`访问统计概览_${tag}.csv`, toCsv(rows));
  };

  const handleExportLessonsCsv = () => {
    const rows: Array<Array<string | number | null | undefined>> = [
      [
        '层级',
        '讲次ID',
        '讲次名称',
        '幕序号',
        '幕标题',
        '幕类型',
        '独立设备',
        '会话数',
        '浏览量',
        '相对首幕留存率(%)',
        '完课会话',
        '作业打开会话',
        '平均停留(秒)',
        '中位停留(秒)',
        '首次运行耗时(秒)',
        '代码运行次数',
        '运行成功',
        '运行报错',
        '报错会话数',
        '报错后修复数',
        '改过代码运行',
        '未改代码运行',
        '答题总次数',
        '答题正确次数',
        '首次答对次数',
        '查看提示次数',
        'AI审查次数',
        '高频异常类型',
      ],
    ];
    for (const lesson of lessons) {
      const lessonName = formatLessonTitle(lesson.lessonId);
      const baseViews = Math.max(
        1,
        lesson.scenes[0]?.views ?? 0,
        ...lesson.scenes.map((s) => s.views),
      );
      const errSummary = lesson.errorTypes.map((e) => `${e.key}:${e.count}`).join('; ');
      rows.push([
        '讲次汇总',
        lesson.lessonId,
        lessonName,
        '',
        '',
        '',
        lesson.visitors,
        lesson.sessions,
        lesson.views,
        '',
        lesson.completions,
        lesson.homeworkOpens,
        lesson.avgDwellSeconds,
        lesson.medianDwellSeconds,
        lesson.avgFirstRunSeconds,
        lesson.runs,
        lesson.runOk,
        lesson.runError,
        lesson.errorSessions,
        lesson.fixedErrors,
        lesson.codeChanged,
        lesson.codeSame,
        lesson.choices,
        lesson.choicesCorrect,
        lesson.firstTryCorrect,
        lesson.hintViews,
        lesson.aiReviews,
        errSummary,
      ]);
      for (const scene of lesson.scenes) {
        const meta = formatSceneLabel(lesson.lessonId, scene.sceneIndex, scene.partId);
        const retention = Math.min(100, Math.round((scene.views / baseViews) * 100));
        rows.push([
          '教学幕明细',
          lesson.lessonId,
          lessonName,
          scene.sceneIndex + 1,
          meta.title,
          meta.kind ?? '',
          '',
          scene.sessions,
          scene.views,
          retention,
          '',
          '',
          scene.avgDwellSeconds,
          scene.medianDwellSeconds,
          '',
          scene.runs,
          scene.runOk,
          scene.runError,
          scene.errorSessions,
          scene.fixedErrors,
          '',
          '',
          scene.choices,
          scene.choicesCorrect,
          scene.firstTryCorrect,
          scene.hintViews,
          scene.aiReviews,
          '',
        ]);
      }
    }
    const tag = (summary?.date ?? today).replace(/\s+/g, '');
    downloadTextFile(`各讲学情明细_${tag}.csv`, toCsv(rows));
  };

  return (
    <TeacherPanel title="访问统计" onClose={onClose} wide initialWidth={920} initialHeight={760}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-classroom-border/70">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-classroom-border bg-classroom-playground p-0.5">
            {(
              [
                ['day', '按日'],
                ['last7', '近 7 天'],
                ['all', '本学期累计'],
                ['custom', '自定义段'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setRangeMode(mode)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  rangeMode === mode
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {rangeMode === 'day' && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                title="前一天"
                onClick={() => setDate((d) => shiftDateYmd(d, -1))}
                className="rounded-lg border border-classroom-border px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
              >
                ‹
              </button>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border border-classroom-border bg-classroom-playground px-2.5 py-1 text-sm text-text-primary"
              />
              <button
                type="button"
                title="后一天"
                onClick={() => setDate((d) => shiftDateYmd(d, 1))}
                className="rounded-lg border border-classroom-border px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
              >
                ›
              </button>
              {date !== today && (
                <button
                  type="button"
                  onClick={() => setDate(today)}
                  className="rounded-lg border border-classroom-border px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
                >
                  今天
                </button>
              )}
            </div>
          )}

          {rangeMode === 'custom' && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="rounded-xl border border-classroom-border bg-classroom-playground px-2.5 py-1 text-sm text-text-primary"
              />
              <span>至</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="rounded-xl border border-classroom-border bg-classroom-playground px-2.5 py-1 text-sm text-text-primary"
              />
            </div>
          )}

          <label className="text-sm text-text-secondary flex items-center gap-1.5 ml-1">
            <input
              type="checkbox"
              checked={includeTeacher}
              onChange={(e) => setIncludeTeacher(e.target.checked)}
            />
            含教师演示
          </label>
          {(overviewBusy || dayBusy) && <span className="text-xs text-text-secondary">载入中…</span>}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!overview && !summary}
            onClick={handleExportOverviewCsv}
          >
            导出概览 CSV
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={lessons.length === 0}
            onClick={handleExportLessonsCsv}
          >
            导出学情明细 CSV
          </Button>
        </div>
      </div>

      {error && <p className="text-error text-sm mb-3">{error}</p>}
      {(summary?.truncated || lessonsTruncated) && (
        <p className="text-xs rounded-xl border border-highlight/40 bg-highlight/10 px-3 py-2 mb-4 text-text-primary">
          所选时间跨度内事件超过单次分析上限（10 万条），当前展示前 10 万条记录；可缩小自定义日期段查看精确切片。
        </p>
      )}

      {overview && (
        <section className="mb-6">
          <p className="text-sm text-text-secondary mb-3">{overview.note}</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <TotalsColumn
              title="累计"
              sessionsLabel={overview.excludeTeacher ? '学生会话' : '会话'}
              totals={overview.totals}
            />
            <TotalsColumn
              title="近 7 天"
              sessionsLabel={overview.excludeTeacher ? '学生会话' : '会话'}
              totals={overview.last7}
            />
          </div>
          <h3 className="text-base font-semibold mb-2">近 7 天趋势</h3>
          <WeekLines days={overview.days} />
          <div className="flex items-center gap-2 mt-5 mb-2">
            <h3 className="text-base font-semibold">访问地图与城市</h3>
            <Button
              type="button"
              variant={mapMetric === 'total' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setMapMetric('total')}
            >
              累计
            </Button>
            <Button
              type="button"
              variant={mapMetric === 'last7' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setMapMetric('last7')}
            >
              近 7 天
            </Button>
          </div>
          <VisitMap cities={overview.cities} provinces={overview.provinces} metric={mapMetric} />
          <CityBars cities={overview.cities} />
          <CityTable cities={overview.cities} />
        </section>
      )}

      {summary && (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-2 pt-4 border-t border-classroom-border/70 mb-2">
            <h3 className="text-base font-semibold">
              所选范围学情（{summary.date}）
            </h3>
          </div>
          <p className="text-sm text-text-secondary mb-4">{summary.note}</p>
          {summary.emptyStudents && (
            <p className="text-sm rounded-2xl border border-accent/40 bg-accent/5 px-4 py-3 mb-4">
              去掉教师演示后该时段暂无学生访问。课上投影不会记入学情；可查看「课后作业打开」或切换到「近 7 天 / 本学期累计」。
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
            <MetricCard label="独立设备" value={summary.visitors} />
            <MetricCard
              label="学生会话"
              value={summary.studentUv}
              sub={`教师演示 ${summary.teacherUv}`}
            />
            <MetricCard label="浏览次数" value={summary.pv} />
            <MetricCard label="代码运行" value={summary.runs} />
            <MetricCard label="课后作业打开" value={summary.homeworkOpens} />
          </div>

          <section className="mb-5">
            <h3 className="text-base font-semibold mb-2">按小时活跃度（北京时间）</h3>
            <div className="flex items-end gap-0.5 h-24">
              {summary.timeline.map((row) => (
                <div
                  key={row.hour}
                  className="flex-1 bg-accent/70 hover:bg-accent rounded-t min-h-[2px] transition-colors"
                  style={{ height: `${Math.max(4, (row.count / maxHour) * 100)}%` }}
                  title={`${row.hour}:00–${row.hour}:59 · ${row.count} 次浏览/作业事件`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>0 时</span>
              <span>6 时</span>
              <span>12 时</span>
              <span>18 时</span>
              <span>23 时</span>
            </div>
          </section>

          <div className="grid md:grid-cols-3 gap-4 mb-5">
            <section>
              <h3 className="text-base font-semibold mb-2">地区</h3>
              <ul className="text-sm space-y-1 max-h-40 overflow-y-auto pr-1">
                {(summary.byRegion ?? []).length === 0 && <li className="text-text-secondary">暂无</li>}
                {(summary.byRegion ?? []).map((row) => (
                  <li key={row.key} className="flex justify-between gap-2">
                    <span className="truncate">{row.key}</span>
                    <span className="tabular-nums">{row.count}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-base font-semibold mb-2">来源</h3>
              <ul className="text-sm space-y-1 max-h-40 overflow-y-auto pr-1">
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
            <summary className="text-base font-semibold cursor-pointer">最近交互明细（最多 50 条）</summary>
            <p className="text-xs text-text-secondary mb-2 mt-2">校园网 Wi-Fi / 机房 NAT 下多人会共用同一出口 IP，统计已按独立设备与会话识别。</p>
            <div className="overflow-x-auto rounded-xl border border-classroom-border">
              <table className="w-full text-sm">
                <thead className="bg-classroom-playground text-text-secondary">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">时间</th>
                    <th className="text-left px-3 py-2 font-medium">动作</th>
                    <th className="text-left px-3 py-2 font-medium">地区</th>
                    <th className="text-left px-3 py-2 font-medium">设备</th>
                    <th className="text-left px-3 py-2 font-medium">讲次与教学幕</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recent.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-text-secondary">
                        该时段暂无记录
                      </td>
                    </tr>
                  )}
                  {summary.recent.map((row, i) => {
                    const lessonTitle = row.lessonId ? formatLessonTitle(row.lessonId) : null;
                    const sceneInfo =
                      row.lessonId && row.sceneIndex != null
                        ? formatSceneLabel(row.lessonId, row.sceneIndex)
                        : null;
                    return (
                      <tr key={`${row.ts}-${i}`} className="border-t border-classroom-border/60">
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{row.tsLocal}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-text-secondary">
                          {HIT_TYPE_LABEL[row.type] ?? row.type}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap" title={row.ip}>
                          {row.region || '—'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">{row.device}</td>
                        <td className="px-3 py-2">
                          {row.lessonId ? (
                            <button
                              type="button"
                              onClick={() => jumpToClassroom(row.lessonId!, row.sceneIndex)}
                              className="text-left text-accent hover:underline"
                            >
                              {lessonTitle}
                              {sceneInfo ? ` › ${sceneInfo.title}` : ''}
                            </button>
                          ) : (
                            row.path || '—'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>

          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h3 className="text-base font-semibold">各讲热度与卡壳诊断</h3>
              <span className="text-xs text-text-secondary">
                展开讲次可查看单幕留存率、报错修复情况，点击幕标题可直接跳回该课件页
              </span>
            </div>
            {lessons.length === 0 && <p className="text-sm text-text-secondary">所选时段还没有课堂浏览记录</p>}
            <ul className="space-y-2.5">
              {lessons.map((lesson) => {
                const isOpen = openLesson === lesson.lessonId;
                const title = formatLessonTitle(lesson.lessonId);
                const baseViews = Math.max(
                  1,
                  lesson.scenes[0]?.views ?? 0,
                  ...lesson.scenes.map((s) => s.views),
                );
                return (
                  <li key={lesson.lessonId} className="rounded-2xl border border-classroom-border px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenLesson((id) => (id === lesson.lessonId ? null : lesson.lessonId))
                        }
                        className="text-left font-semibold text-text-primary hover:text-accent transition-colors flex items-center gap-2"
                      >
                        <span>{isOpen ? '▾' : '▸'}</span>
                        <span>{title}</span>
                        <span className="text-xs font-normal text-text-secondary">({lesson.lessonId})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => jumpToClassroom(lesson.lessonId)}
                        className="text-xs text-accent hover:underline"
                      >
                        打开课件 →
                      </button>
                    </div>

                    <div className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                      设备 {lesson.visitors} · 会话 {lesson.sessions} · 浏览 {lesson.views} · 完课{' '}
                      {lesson.completions} · 作业 {lesson.homeworkOpens} · 运行 {lesson.runs}（成功{' '}
                      {lesson.runOk} / 报错 {lesson.runError}
                      {lesson.errorSessions > 0
                        ? `，当场修复 ${lesson.fixedErrors}/${lesson.errorSessions}`
                        : ''}
                      ，改码 {lesson.codeChanged} / 原样 {lesson.codeSame}）· 选择{' '}
                      {lesson.choicesCorrect}/{lesson.choices}（首答对 {lesson.firstTryCorrect}）· 首跑{' '}
                      {lesson.avgFirstRunSeconds}s · 停留均值 {lesson.avgDwellSeconds}s（中位{' '}
                      {lesson.medianDwellSeconds}s）
                      {(lesson.hintViews > 0 || lesson.aiReviews > 0) && (
                        <>
                          {' '}
                          · 提示 {lesson.hintViews} 次 · AI 审查 {lesson.aiReviews} 次
                        </>
                      )}
                    </div>

                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-classroom-border/60">
                        {lesson.errorTypes.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
                            <span className="text-text-secondary">常见报错：</span>
                            {lesson.errorTypes.map((row) => (
                              <span
                                key={row.key}
                                className="rounded-lg border border-error/30 bg-error/10 px-2 py-0.5 font-mono text-error"
                              >
                                {row.key} × {row.count}
                              </span>
                            ))}
                          </div>
                        )}
                        <ul className="text-sm space-y-1.5">
                          {lesson.scenes.map((scene) => (
                            <SceneHeatRow
                              key={scene.sceneIndex}
                              lessonId={lesson.lessonId}
                              lessonAvgDwell={lesson.avgDwellSeconds}
                              baseViews={baseViews}
                              scene={scene}
                              onJump={() => jumpToClassroom(lesson.lessonId, scene.sceneIndex)}
                            />
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
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

function MetricCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-classroom-border px-4 py-3">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="text-2xl title-stage text-text-primary mt-1 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-text-secondary mt-0.5">{sub}</p>}
    </div>
  );
}

function SceneHeatRow({
  lessonId,
  lessonAvgDwell,
  baseViews,
  scene,
  onJump,
}: {
  lessonId: string;
  lessonAvgDwell: number;
  baseViews: number;
  scene: LessonSceneHeat;
  onJump: () => void;
}) {
  const meta = formatSceneLabel(lessonId, scene.sceneIndex, scene.partId);
  const retentionPct = Math.min(100, Math.round((scene.views / baseViews) * 100));
  const judgedRuns = scene.runOk + scene.runError;
  const highError = judgedRuns >= 2 && scene.runError / judgedRuns >= 0.4;
  const lowChoiceAcc = scene.choices >= 2 && scene.firstTryCorrect / scene.choices < 0.5;
  const highDwell =
    scene.avgDwellSeconds >= 60 &&
    scene.avgDwellSeconds >= Math.max(60, Math.round(lessonAvgDwell * 1.6));

  return (
    <li className="relative overflow-hidden rounded-xl border border-classroom-border/60 px-3 py-2">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 bg-accent/10"
        style={{ width: `${retentionPct}%` }}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <button
            type="button"
            onClick={onJump}
            className="text-left font-medium text-text-primary hover:text-accent hover:underline truncate"
            title="点击跳转到该教学幕"
          >
            {meta.title}
          </button>
          {meta.kind && (
            <span className="rounded-md bg-classroom-playground px-1.5 py-0.5 text-[11px] text-text-secondary">
              {meta.kind}
            </span>
          )}
          {highError && (
            <span className="rounded-md bg-error/15 px-1.5 py-0.5 text-[11px] font-medium text-error">
              易报错
            </span>
          )}
          {lowChoiceAcc && (
            <span className="rounded-md bg-highlight/20 px-1.5 py-0.5 text-[11px] font-medium text-highlight">
              预测易错
            </span>
          )}
          {highDwell && (
            <span className="rounded-md bg-accent/20 px-1.5 py-0.5 text-[11px] font-medium text-accent">
              停留久
            </span>
          )}
        </div>

        <span className="text-xs text-text-secondary tabular-nums">
          浏览 {scene.views}（{retentionPct}%）· 停留 {scene.avgDwellSeconds}s
          {scene.medianDwellSeconds > 0 ? `（中位 ${scene.medianDwellSeconds}s）` : ''}
          {scene.runs > 0 && (
            <>
              {' '}
              · 运行 {scene.runs}（成 {scene.runOk} / 错 {scene.runError}
              {scene.errorSessions > 0 ? `，修复 ${scene.fixedErrors}/${scene.errorSessions}` : ''}）
            </>
          )}
          {scene.choices > 0 && (
            <>
              {' '}
              · 答题 {scene.choicesCorrect}/{scene.choices}（首对 {scene.firstTryCorrect}）
            </>
          )}
          {(scene.hintViews > 0 || scene.aiReviews > 0) && (
            <>
              {' '}
              · 求助 {scene.hintViews + scene.aiReviews}
            </>
          )}
        </span>
      </div>
    </li>
  );
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
    ['独立设备', totals.visitors],
    [sessionsLabel, totals.sessions],
    ['浏览次数', totals.pv],
    ['作业打开', totals.homeworkOpens],
    ['覆盖城市', totals.cities],
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
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const width = 640;
  const height = 200;
  const left = 40;
  const right = 44;
  const top = 28;
  const bottom = 32;
  const innerW = width - left - right;
  const innerH = height - top - bottom;
  const maxPv = Math.max(1, ...days.map((day) => day.pv));
  const maxSessions = Math.max(1, ...days.map((day) => Math.max(day.sessions, day.homeworkOpens)));
  const xAt = (index: number) => left + (days.length <= 1 ? innerW / 2 : (index / (days.length - 1)) * innerW);
  const yPv = (value: number) => top + innerH - (value / maxPv) * innerH;
  const ySessions = (value: number) => top + innerH - (value / maxSessions) * innerH;
  const line = (values: number[], yAt: (value: number) => number) =>
    values.map((value, index) => `${index === 0 ? 'M' : 'L'}${xAt(index).toFixed(1)} ${yAt(value).toFixed(1)}`).join(' ');
  const pvLine = line(days.map((day) => day.pv), yPv);
  const area = `${pvLine} L${xAt(days.length - 1).toFixed(1)} ${(top + innerH).toFixed(1)} L${xAt(0).toFixed(1)} ${(top + innerH).toFixed(1)} Z`;
  const grids = [0.25, 0.5, 0.75, 1];
  const activeDay = hoverIdx != null ? days[hoverIdx] : days[days.length - 1];

  return (
    <div>
      {activeDay && (
        <p className="text-xs text-text-secondary mb-1.5 tabular-nums">
          <span className="font-medium text-text-primary">{activeDay.date}</span>
          {' · '}独立设备 {activeDay.visitors} · 会话 {activeDay.sessions} · 浏览 {activeDay.pv} · 作业打开{' '}
          {activeDay.homeworkOpens}
        </p>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label="近七日访问"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <rect x={0} y={0} width={width} height={height} rx={16} className="fill-classroom-playground" />
        {grids.map((step) => (
          <line
            key={step}
            x1={left}
            x2={width - right}
            y1={top + innerH * (1 - step)}
            y2={top + innerH * (1 - step)}
            className="stroke-classroom-border"
            strokeDasharray="3 4"
          />
        ))}
        <path d={area} className="fill-accent/15" />
        <path d={pvLine} className="fill-none stroke-accent" strokeWidth={2.5} strokeLinejoin="round" />
        <path d={line(days.map((day) => day.sessions), ySessions)} className="fill-none stroke-text-primary" strokeWidth={2} strokeLinejoin="round" />
        <path
          d={line(days.map((day) => day.homeworkOpens), ySessions)}
          className="fill-none stroke-highlight"
          strokeWidth={2}
          strokeDasharray="5 4"
          strokeLinejoin="round"
        />
        {hoverIdx != null && days[hoverIdx] && (
          <line
            x1={xAt(hoverIdx)}
            x2={xAt(hoverIdx)}
            y1={top}
            y2={top + innerH}
            className="stroke-accent/50"
            strokeDasharray="2 2"
          />
        )}
        {days.map((day, index) => {
          const colW = days.length <= 1 ? innerW : innerW / (days.length - 1);
          const isHovered = hoverIdx === index;
          return (
            <g key={day.date} onMouseEnter={() => setHoverIdx(index)}>
              <circle
                cx={xAt(index)}
                cy={yPv(day.pv)}
                r={isHovered ? 5 : 3.5}
                className="fill-classroom-playground stroke-accent"
                strokeWidth={2}
              >
                <title>{`${day.date} · 设备 ${day.visitors} · 会话 ${day.sessions} · 浏览 ${day.pv} · 作业 ${day.homeworkOpens}`}</title>
              </circle>
              <text
                x={xAt(index)}
                y={height - 10}
                textAnchor="middle"
                className={isHovered ? 'fill-text-primary font-semibold' : 'fill-text-secondary'}
                fontSize={12}
              >
                {day.date.slice(5)}
              </text>
              <rect
                x={xAt(index) - colW / 2}
                y={top}
                width={colW}
                height={innerH + 20}
                fill="transparent"
              />
            </g>
          );
        })}
        <text x={left} y={16} className="fill-accent" fontSize={12}>
          浏览峰值 {maxPv}
        </text>
        <text x={width - right} y={16} textAnchor="end" className="fill-text-primary" fontSize={12}>
          会话峰值 {maxSessions}
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 bg-accent" />浏览次数</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 bg-text-primary" />会话数</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-highlight" />作业打开</span>
      </div>
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
