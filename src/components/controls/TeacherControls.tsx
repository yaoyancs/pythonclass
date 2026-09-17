import { useMemo, useState } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useRosterSession } from '../../hooks/useRosterSession';
import { getClassLabel, rosterSummary } from '../../utils/rosterStorage';
import { Button } from '../ui/Button';
import { AttendancePanel } from './AttendancePanel';
import { ClassSwitcher } from './ClassSwitcher';
import { JumpLessonPanel } from './JumpLessonPanel';
import { JumpPagePanel } from './JumpPagePanel';
import { PerformancePanel } from './PerformancePanel';
import { PickStudentOverlay } from './PickStudentOverlay';
import { RosterManagePanel } from './RosterManagePanel';

type Panel = 'none' | 'lesson' | 'page' | 'pick' | 'attendance' | 'performance' | 'roster';

export function TeacherControls() {
  const { lesson, dispatch } = useSceneEngine();
  const [expanded, setExpanded] = useState(false);
  const [panel, setPanel] = useState<Panel>('none');

  const {
    classId,
    setClassId,
    classes,
    students,
    session,
    semester,
    attendanceLog,
    rosterVersion,
    replaceRoster,
    createClass,
    updateClass,
    removeClass,
    updateAttendance,
    markAllPresent,
    changeFlowers,
    commitPick,
    getPickPool,
  } = useRosterSession(lesson.id);

  const classCounts = useMemo(() => {
    void rosterVersion;
    void classes;
    const map: Record<string, number> = {};
    for (const row of rosterSummary()) map[row.id] = row.count;
    return map;
  }, [rosterVersion, classes]);

  const closePanel = () => setPanel('none');
  const classLabel = classId ? getClassLabel(classId) : '未选班';

  const controls: { label: string; action: () => void }[] = [
    {
      label: '跳转到某一讲',
      action: () => setPanel('lesson'),
    },
    {
      label: '跳转到本讲某页',
      action: () => setPanel('page'),
    },
    {
      label: '初始化本页',
      action: () => {
        if (window.confirm('确定初始化本页？本页互动进度与代码将重置。')) {
          dispatch({ type: 'RESTART_SCENE' });
        }
      },
    },
    {
      label: '抽点学生',
      action: () => setPanel('pick'),
    },
    {
      label: '考勤',
      action: () => setPanel('attendance'),
    },
    {
      label: '课堂表现',
      action: () => setPanel('performance'),
    },
    {
      label: '班级名单',
      action: () => setPanel('roster'),
    },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant="ghost" size="md" onClick={() => setExpanded((v) => !v)}>
        教师控制台 · {classLabel} {expanded ? '▴' : '▾'}
      </Button>
      {expanded && (
        <div className="flex flex-col items-center gap-2 max-w-3xl">
          <ClassSwitcher
            classes={classes}
            value={classId}
            onChange={setClassId}
            counts={classCounts}
          />
          <div className="flex flex-wrap justify-center gap-2">
            {controls.map((c) => (
              <Button key={c.label} variant="secondary" size="md" onClick={c.action}>
                {c.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {panel === 'lesson' && <JumpLessonPanel onClose={closePanel} />}
      {panel === 'page' && <JumpPagePanel onClose={closePanel} />}
      {panel === 'roster' && (
        <RosterManagePanel
          classes={classes}
          onReplace={(id, list, source) => {
            replaceRoster(id, list, source);
          }}
          onCreateClass={createClass}
          onRenameClass={updateClass}
          onDeleteClass={removeClass}
          onClose={closePanel}
        />
      )}
      {panel === 'attendance' && (
        <AttendancePanel
          classId={classId}
          classes={classes}
          classCounts={classCounts}
          onClassChange={setClassId}
          students={students}
          session={session}
          attendanceLog={attendanceLog}
          onManageRoster={() => setPanel('roster')}
          onUpdate={updateAttendance}
          onMarkAllPresent={markAllPresent}
          onClose={closePanel}
        />
      )}
      {panel === 'performance' && (
        <PerformancePanel
          classId={classId}
          classes={classes}
          classCounts={classCounts}
          onClassChange={setClassId}
          students={students}
          session={session}
          semester={semester}
          onManageRoster={() => setPanel('roster')}
          onChangeFlowers={changeFlowers}
          onClose={closePanel}
        />
      )}
      {panel === 'pick' && (
        <PickStudentOverlay
          pool={getPickPool()}
          session={session}
          semester={semester}
          onPicked={commitPick}
          onChangeFlowers={changeFlowers}
          onClose={closePanel}
          onNeedRoster={() => setPanel(students.length ? 'attendance' : 'roster')}
        />
      )}
    </div>
  );
}
