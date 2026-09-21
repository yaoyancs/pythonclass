import { fetchAnalyticsSummary, fetchLessonHeat } from '../../api/analyticsApi';
import type { LessonHeat, SummaryResult } from '../../analytics/types';
import { TeacherApiError, loadTeacherToken } from '../../api/teacherApi';
import { shanghaiDateInputValue } from '../../analytics/dates';
import { Button } from '../ui/Button';
import { TeacherPanel } from './TeacherPanel';
import { useEffect, useState } from 'react';

interface AnalyticsPanelProps {
  onClose: () => void;
}

export function AnalyticsPanel({ onClose }: AnalyticsPanelProps) {
  const [date, setDate] = useState(() => shanghaiDateInputValue());
  const [includeTeacher, setIncludeTeacher] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [lessons, setLessons] = useState<LessonHeat[]>([]);
  const [openLesson, setOpenLesson] = useState<string | null>(null);

  useEffect(() => {
    const token = loadTeacherToken();
    if (!token) {
      setError('未登录教师台');
      return;
    }
    let cancelled = false;
    setBusy(true);
    setError(null);
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
        const message =
          err instanceof TeacherApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : '读取失败';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, includeTeacher]);

  const maxHour = Math.max(1, ...(summary?.timeline.map((t) => t.count) ?? [1]));

  return (
    <TeacherPanel title="访问统计" onClose={onClose} wide initialWidth={820} initialHeight={640}>
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
        {busy && <span className="text-sm text-text-secondary">载入中…</span>}
      </div>
      {error && <p className="text-error text-sm mb-3">{error}</p>}
      {summary && (
        <>
          <p className="text-sm text-text-secondary mb-4">{summary.note}</p>
          {summary.emptyStudents && (
            <p className="text-sm rounded-2xl border border-accent/40 bg-accent/5 px-4 py-3 mb-4">
              去掉教师演示后暂无学生访问。课上投影不会记入学情；看「课后作业打开数」是否有人从封面点进来。
            </p>
          )}
          <div className="rounded-2xl border-2 border-accent px-4 py-4 mb-4">
            <p className="text-sm text-text-secondary">课后作业打开数</p>
            <p className="text-5xl title-stage text-accent mt-1">{summary.homeworkOpens}</p>
            <p className="text-xs text-text-secondary mt-2">封面「作业」链接，按独立会话计</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
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
                    <th className="text-left px-3 py-2 font-medium">IP</th>
                    <th className="text-left px-3 py-2 font-medium">设备</th>
                    <th className="text-left px-3 py-2 font-medium">来源</th>
                    <th className="text-left px-3 py-2 font-medium">页面</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recent.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-text-secondary">
                        当天暂无记录
                      </td>
                    </tr>
                  )}
                  {summary.recent.map((row, i) => (
                    <tr key={`${row.ts}-${i}`} className="border-t border-classroom-border/60">
                      <td className="px-3 py-2 whitespace-nowrap">{row.tsLocal}</td>
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
                      作业 {lesson.homeworkOpens} · 浏览 {lesson.views} · 会话 {lesson.sessions} · 运行{' '}
                      {lesson.runs} · 平均停留 {lesson.avgDwellSeconds}s
                    </span>
                  </div>
                  {openLesson === lesson.lessonId && (
                    <ul className="mt-2 text-sm space-y-1 pl-2">
                      {lesson.scenes.map((scene) => (
                        <li key={scene.sceneIndex} className="flex justify-between gap-2">
                          <span>
                            第 {scene.sceneIndex + 1} 幕
                            {scene.partId ? ` · ${scene.partId}` : ''}
                          </span>
                          <span className="text-text-secondary tabular-nums">
                            浏览 {scene.views} · 停留 {scene.avgDwellSeconds}s · 运行 {scene.runs}
                          </span>
                        </li>
                      ))}
                    </ul>
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
