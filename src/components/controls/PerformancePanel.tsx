import type { ClassId, TeachingClass } from '../../data/classes';
import type { SemesterLedger, SessionLedger, Student } from '../../types/roster';
import { downloadTextFile } from '../../utils/csv';
import { getClassLabel } from '../../utils/rosterStorage';
import { FlowerCount } from '../ui/FlowerIcon';
import { Button } from '../ui/Button';
import { ClassSwitcher } from './ClassSwitcher';
import { TeacherPanel } from './TeacherPanel';

interface PerformancePanelProps {
  classId: ClassId;
  classes: TeachingClass[];
  classCounts: Record<string, number>;
  onClassChange: (id: ClassId) => void;
  students: Student[];
  session: SessionLedger;
  semester: SemesterLedger;
  onManageRoster: () => void;
  onChangeFlowers: (studentId: string, delta: number) => void;
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
  onManageRoster,
  onChangeFlowers,
  onClose,
}: PerformancePanelProps) {
  const metaLabel = getClassLabel(classId);
  const rows = [...students].sort((a, b) => {
    const sa = semester.flowers[a.id] ?? 0;
    const sb = semester.flowers[b.id] ?? 0;
    if (sb !== sa) return sb - sa;
    return a.name.localeCompare(b.name, 'zh');
  });

  const exportSemesterFlowers = () => {
    const header = '学号,姓名,学期小红花';
    const lines = [...students]
      .sort((a, b) => (semester.flowers[b.id] ?? 0) - (semester.flowers[a.id] ?? 0))
      .map((s) => {
        const no = s.studentNo ?? '';
        const semesterF = semester.flowers[s.id] ?? 0;
        return `${no},${s.name},${semesterF}`;
      });
    downloadTextFile(`学期小红花_${metaLabel}.csv`, [header, ...lines].join('\n'));
  };

  return (
    <TeacherPanel title={`课堂表现 · ${metaLabel}`} onClose={onClose} wide initialHeight={600}>
      <ClassSwitcher
        classes={classes}
        value={classId}
        onChange={onClassChange}
        counts={classCounts}
      />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <p className="text-sm text-text-secondary mr-auto">本堂与学期小红花仅计本班</p>
        <Button variant="ghost" size="md" type="button" onClick={onManageRoster}>
          管理名单
        </Button>
        {students.length > 0 && (
          <Button variant="secondary" size="md" type="button" onClick={exportSemesterFlowers}>
            导出学期小红花
          </Button>
        )}
      </div>
      <p className="text-sm text-text-secondary mb-3">本堂会话：{session.sessionId}</p>
      {students.length === 0 ? (
        <p className="text-text-secondary">请先导入本班名单。</p>
      ) : (
        <ul className="divide-y divide-classroom-border/60">
          {rows.map((s) => {
            const sessionF = session.flowers[s.id] ?? 0;
            const semesterF = semester.flowers[s.id] ?? 0;
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-lg">{s.name}</p>
                  {s.studentNo && (
                    <p className="text-sm text-text-secondary tabular-nums">{s.studentNo}</p>
                  )}
                </div>
                <p className="text-base text-text-secondary flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    本堂 <FlowerCount count={sessionF} />
                  </span>
                  <span className="text-classroom-border">·</span>
                  <span className="inline-flex items-center gap-1">
                    学期 <FlowerCount count={semesterF} />
                  </span>
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="md"
                    type="button"
                    onClick={() => onChangeFlowers(s.id, 1)}
                  >
                    +花
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    type="button"
                    disabled={sessionF <= 0 && semesterF <= 0}
                    onClick={() => onChangeFlowers(s.id, -1)}
                  >
                    −花
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </TeacherPanel>
  );
}
