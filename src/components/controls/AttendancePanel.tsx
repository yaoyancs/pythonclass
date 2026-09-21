import { useMemo, useState } from 'react';
import type { ClassId, TeachingClass } from '../../data/classes';
import type {
  AttendanceLog,
  AttendanceStatus,
  SessionLedger,
  Student,
} from '../../types/roster';
import { downloadTextFile } from '../../utils/csv';
import {
  buildAttendanceRanking,
  exportAttendanceCsv,
  getClassLabel,
  studentMatchesQuery,
} from '../../utils/rosterStorage';
import { Button } from '../ui/Button';
import { ClassSwitcher } from './ClassSwitcher';
import { TeacherPanel } from './TeacherPanel';

const STATUSES: { value: AttendanceStatus; label: string }[] = [
  { value: 'present', label: '出席' },
  { value: 'absent', label: '缺席' },
  { value: 'leave', label: '请假' },
  { value: 'unknown', label: '未点' },
];

interface AttendancePanelProps {
  classId: ClassId;
  classes: TeachingClass[];
  classCounts: Record<string, number>;
  onClassChange: (id: ClassId) => void;
  students: Student[];
  session: SessionLedger;
  attendanceLog: AttendanceLog;
  onManageRoster: () => void;
  onUpdate: (studentId: string, status: AttendanceStatus) => void;
  onMarkAllPresent: () => void;
  onStartNewSession: () => void;
  onClose: () => void;
}

export function AttendancePanel({
  classId,
  classes,
  classCounts,
  onClassChange,
  students,
  session,
  attendanceLog,
  onManageRoster,
  onUpdate,
  onMarkAllPresent,
  onStartNewSession,
  onClose,
}: AttendancePanelProps) {
  const metaLabel = getClassLabel(classId);
  const [tab, setTab] = useState<'today' | 'rank'>('today');
  const [query, setQuery] = useState('');

  const ranking = useMemo(
    () => buildAttendanceRanking(students, attendanceLog),
    [students, attendanceLog],
  );

  const filtered = useMemo(
    () => students.filter((s) => studentMatchesQuery(s, query)),
    [students, query],
  );

  const startFresh = () => {
    const ok = window.confirm(
      '开始新的本堂考勤？上次记录会留在学期档案中，不会被覆盖。本堂名单将全部回到「未点」。',
    );
    if (!ok) return;
    setQuery('');
    onStartNewSession();
  };

  const exportSemester = () => {
    if (!attendanceLog.entries.length) {
      window.alert('尚无考勤记录可导出。完成本堂考勤后会自动写入学期档案。');
      return;
    }
    const csv = exportAttendanceCsv(students, attendanceLog);
    downloadTextFile(`考勤_${metaLabel}_学期.csv`, csv);
  };

  return (
    <TeacherPanel title={`考勤 · ${metaLabel}`} onClose={onClose} wide initialHeight={620}>
      <ClassSwitcher
        classes={classes}
        value={classId}
        onChange={onClassChange}
        counts={classCounts}
      />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <p className="text-sm text-text-secondary mr-auto">
          已记录 {attendanceLog.entries.length} 次课 · {session.date} · 本堂 {session.sessionId}
        </p>
        <Button variant="ghost" size="md" type="button" onClick={onManageRoster}>
          管理名单
        </Button>
        <Button variant="secondary" size="md" type="button" onClick={exportSemester}>
          导出学期考勤
        </Button>
        {students.length > 0 && tab === 'today' && (
          <>
            <Button variant="secondary" size="md" type="button" onClick={onMarkAllPresent}>
              全员出席
            </Button>
            <Button variant="secondary" size="md" type="button" onClick={startFresh}>
              新开本堂
            </Button>
          </>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          size="md"
          variant={tab === 'today' ? 'primary' : 'secondary'}
          onClick={() => setTab('today')}
        >
          本堂考勤
        </Button>
        <Button
          type="button"
          size="md"
          variant={tab === 'rank' ? 'primary' : 'secondary'}
          onClick={() => setTab('rank')}
        >
          考勤排行榜
        </Button>
      </div>

      {students.length === 0 ? (
        <p className="text-text-secondary">
          请先在「班级名单」中导入本班 CSV（一次即可）。
        </p>
      ) : tab === 'today' ? (
        <>
          <label className="block mb-3">
            <span className="sr-only">按学号或姓名搜索</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="按学号或姓名搜索，定向标记出勤"
              className="w-full rounded-full border border-classroom-border bg-white px-4 py-2.5 text-base outline-none focus:border-accent"
            />
          </label>
          {filtered.length === 0 ? (
            <p className="text-text-secondary">没有匹配「{query.trim()}」的同学。</p>
          ) : (
            <>
              {query.trim() && (
                <p className="text-sm text-text-secondary mb-2">
                  找到 {filtered.length} 人（共 {students.length} 人）
                </p>
              )}
              <ul className="divide-y divide-classroom-border/60">
                {filtered.map((s) => {
                  const status = session.attendance[s.id] ?? 'unknown';
                  return (
                    <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-lg">{s.name}</p>
                        {s.studentNo && (
                          <p className="text-sm text-text-secondary tabular-nums">{s.studentNo}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {STATUSES.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            className={`rounded-full px-3 py-1.5 text-sm border transition-colors ${
                              status === opt.value
                                ? 'bg-accent text-white border-accent'
                                : 'border-classroom-border text-text-secondary hover:border-accent/50'
                            }`}
                            onClick={() => onUpdate(s.id, opt.value)}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      ) : attendanceLog.entries.length === 0 ? (
        <p className="text-text-secondary">完成本堂考勤后，将累计形成学期排行榜。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead>
              <tr className="text-sm text-text-secondary border-b border-classroom-border">
                <th className="py-2 pr-3 font-medium">名次</th>
                <th className="py-2 pr-3 font-medium">姓名</th>
                <th className="py-2 pr-3 font-medium">出席</th>
                <th className="py-2 pr-3 font-medium">缺席</th>
                <th className="py-2 pr-3 font-medium">请假</th>
                <th className="py-2 font-medium">出勤率</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((row, i) => (
                <tr key={row.student.id} className="border-b border-classroom-border/50">
                  <td className="py-2.5 pr-3 tabular-nums text-accent">{i + 1}</td>
                  <td className="py-2.5 pr-3">
                    {row.student.name}
                    {row.student.studentNo && (
                      <span className="ml-2 text-sm text-text-secondary tabular-nums">
                        {row.student.studentNo}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums">{row.present}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{row.absent}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{row.leave}</td>
                  <td className="py-2.5 tabular-nums">
                    {Math.round(row.rate * 1000) / 10}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-text-secondary mt-3">
            共 {attendanceLog.entries.length} 次课；出勤率 = 出席 /（出席+缺席+请假）
          </p>
        </div>
      )}
    </TeacherPanel>
  );
}
