import { useMemo, useState } from 'react';
import type { ClassId, TeachingClass } from '../../data/classes';
import type { AttendanceLog, SemesterLedger, SessionLedger, Student } from '../../types/roster';
import { downloadTextFile } from '../../utils/csv';
import {
  REWARD_MIN,
  exportMeetingDetailCsv,
  exportSemesterPerformanceCsv,
  getClassLabel,
  studentMatchesQuery,
} from '../../utils/rosterStorage';
import { CloverCount } from '../ui/CloverIcon';
import { FlowerCount } from '../ui/FlowerIcon';
import { Button } from '../ui/Button';
import { ClassSwitcher } from './ClassSwitcher';
import { PickStudentContent } from './PickStudentOverlay';
import { TeacherPanel } from './TeacherPanel';

type PerformanceTab = 'pick' | 'interact';

interface PerformancePanelProps {
  classId: ClassId;
  classes: TeachingClass[];
  classCounts: Record<string, number>;
  onClassChange: (id: ClassId) => void;
  students: Student[];
  session: SessionLedger;
  semester: SemesterLedger;
  attendanceLog: AttendanceLog;
  pool: Student[];
  onManageRoster: () => void;
  onChangeClovers: (studentId: string, delta: number) => void;
  onChangeFlowers: (studentId: string, delta: number) => void;
  onPicked: (studentId: string) => void;
  onMarkEarlyLeave: (studentId: string) => void;
  onNeedRoster: () => void;
  onClose: () => void;
}

export function PerformancePanel({
  classId,
  classes,
  classCounts,
  onClassChange,
  students,
  session,
  semester,
  attendanceLog,
  pool,
  onManageRoster,
  onChangeClovers,
  onChangeFlowers,
  onPicked,
  onMarkEarlyLeave,
  onNeedRoster,
  onClose,
}: PerformancePanelProps) {
  const metaLabel = getClassLabel(classId);
  const [tab, setTab] = useState<PerformanceTab>('pick');
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () =>
      [...students].sort((a, b) => {
        const ca = semester.clovers[a.id] ?? 0;
        const cb = semester.clovers[b.id] ?? 0;
        if (cb !== ca) return cb - ca;
        const fa = semester.flowers[a.id] ?? 0;
        const fb = semester.flowers[b.id] ?? 0;
        if (fb !== fa) return fb - fa;
        return a.name.localeCompare(b.name, 'zh');
      }),
    [students, semester],
  );

  const filtered = useMemo(
    () => rows.filter((s) => studentMatchesQuery(s, query)),
    [rows, query],
  );

  const exportSemester = () => {
    const csv = exportSemesterPerformanceCsv(students, semester, attendanceLog);
    downloadTextFile(`提问与互动_${metaLabel}_学期.csv`, csv);
  };

  const exportMeetings = () => {
    const csv = exportMeetingDetailCsv(students, classId);
    downloadTextFile(`提问与互动_${metaLabel}_本堂明细.csv`, csv);
  };

  const dark = tab === 'pick';
  const tabClass = (id: PerformanceTab) => {
    const on = tab === id;
    if (dark) {
      return on
        ? 'bg-white text-[#12211c]'
        : 'text-white/70 hover:bg-white/10';
    }
    return on ? 'bg-accent text-white' : 'text-text-secondary hover:bg-accent-muted';
  };

  return (
    <TeacherPanel
      title={`提问与互动 · ${metaLabel}`}
      onClose={onClose}
      wide
      variant={dark ? 'dark' : 'light'}
      initialWidth={1120}
      initialHeight={640}
    >
      <ClassSwitcher
        classes={classes}
        value={classId}
        onChange={onClassChange}
        counts={classCounts}
      />
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className={`inline-flex rounded-full p-1 ${dark ? 'bg-white/10' : 'bg-classroom-border/40'}`}>
          <button
            type="button"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${tabClass('pick')}`}
            onClick={() => setTab('pick')}
          >
            提问
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${tabClass('interact')}`}
            onClick={() => setTab('interact')}
          >
            互动
          </button>
        </div>
        <Button variant="ghost" size="md" type="button" onClick={onManageRoster} className={dark ? 'text-white/80 hover:bg-white/10' : ''}>
          管理名单
        </Button>
        {students.length > 0 && (
          <>
            <Button variant="secondary" size="md" type="button" onClick={exportSemester}>
              导出学期汇总
            </Button>
            <Button variant="secondary" size="md" type="button" onClick={exportMeetings}>
              导出本堂明细
            </Button>
          </>
        )}
      </div>
      <p className={`text-sm mb-4 ${dark ? 'text-white/55' : 'text-text-secondary'}`}>
        提问抽点发小红花（5%）；互动发幸运草（5%）；两项分别按班折算。考勤不算分，缺勤资格在「考勤」里看。
        {session.lessonId ? ` 本堂绑定讲次：${session.lessonId}` : ''}
      </p>
      <p className={`text-sm mb-3 ${dark ? 'text-white/45' : 'text-text-secondary'}`}>
        本堂会话：{session.sessionId}
      </p>
      {tab === 'pick' ? (
        <PickStudentContent
          pool={pool}
          session={session}
          semester={semester}
          onPicked={onPicked}
          onChangeFlowers={onChangeFlowers}
          onMarkEarlyLeave={onMarkEarlyLeave}
          onNeedRoster={onNeedRoster}
        />
      ) : students.length === 0 ? (
        <p className="text-text-secondary">请先导入本班名单。</p>
      ) : (
        <>
          <label className="block mb-3">
            <span className="sr-only">按学号或姓名搜索</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="按学号或姓名搜索，定向记幸运草"
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
              <ul className="divide-y divide-classroom-border/60 max-h-[min(52vh,420px)] overflow-auto">
                {filtered.map((s) => {
                  const sessionF = session.flowers[s.id] ?? 0;
                  const semesterF = semester.flowers[s.id] ?? 0;
                  const sessionC = session.clovers[s.id] ?? 0;
                  const semesterC = semester.clovers[s.id] ?? 0;
                  return (
                    <li key={s.id} className="flex flex-nowrap items-center gap-4 py-3 min-w-max">
                      <div className="w-40 shrink-0">
                        <p className="text-lg whitespace-nowrap">{s.name}</p>
                        {s.studentNo && (
                          <p className="text-sm text-text-secondary tabular-nums whitespace-nowrap">
                            {s.studentNo}
                          </p>
                        )}
                      </div>
                      <p className="text-base text-text-secondary flex items-center gap-3 whitespace-nowrap shrink-0">
                        <span className="inline-flex items-center gap-1">
                          本堂 <FlowerCount count={sessionF} />
                        </span>
                        <span className="text-classroom-border">·</span>
                        <span className="inline-flex items-center gap-1">
                          学期 <FlowerCount count={semesterF} />
                        </span>
                        <span className="text-classroom-border">·</span>
                        <span className="inline-flex items-center gap-1">
                          本堂 <CloverCount count={sessionC} />
                        </span>
                        <span className="text-classroom-border">·</span>
                        <span className="inline-flex items-center gap-1">
                          学期 <CloverCount count={semesterC} />
                        </span>
                      </p>
                      <div className="flex gap-2 shrink-0 ml-auto">
                        <Button
                          variant="secondary"
                          size="md"
                          type="button"
                          onClick={() => onChangeClovers(s.id, 1)}
                        >
                          + 幸运草
                        </Button>
                        <Button
                          variant="ghost"
                          size="md"
                          type="button"
                          disabled={sessionC <= REWARD_MIN}
                          onClick={() => onChangeClovers(s.id, -1)}
                        >
                          − 幸运草
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}
    </TeacherPanel>
  );
}
