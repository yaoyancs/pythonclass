import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useRosterSession } from '../../hooks/useRosterSession';
import { AnalyticsPanel } from './AnalyticsPanel';
import { useTeacherAuth } from '../../hooks/useTeacherAuth';
import { getClassLabel, rosterSummary } from '../../utils/rosterStorage';
import { Button } from '../ui/Button';
import { AttendancePanel } from './AttendancePanel';
import { ClassSwitcher } from './ClassSwitcher';
import { JumpLessonPanel } from './JumpLessonPanel';
import { JumpPagePanel } from './JumpPagePanel';
import { PerformancePanel } from './PerformancePanel';
import { RosterManagePanel } from './RosterManagePanel';
import { TeacherUnlockPanel } from './TeacherUnlockPanel';

type Panel = 'none' | 'attendance' | 'performance' | 'roster' | 'analytics';

function syncLabel(status: ReturnType<typeof useTeacherAuth>['syncStatus']): string {
  if (status === 'syncing') return '同步中…';
  if (status === 'synced') return '已同步云端';
  if (status === 'error') return '云端同步失败';
  return '';
}

/** 页面控制：跳转、初始化，不需要教师解锁 */
function PageControls({ trailing }: { trailing?: ReactNode }) {
  const { dispatch } = useSceneEngine();
  const [panel, setPanel] = useState<'none' | 'lesson' | 'page'>('none');

  return (
    <>
      <div className="flex flex-wrap justify-center items-center gap-1.5">
        <Button variant="secondary" size="sm" onClick={() => setPanel('lesson')}>
          跳转到某一讲
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setPanel('page')}>
          跳转到本讲某页
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (window.confirm('确定初始化本页？本页互动进度与代码将重置。')) {
              dispatch({ type: 'RESTART_SCENE' });
            }
          }}
        >
          初始化本页
        </Button>
        {trailing}
      </div>
      {panel === 'lesson' && <JumpLessonPanel onClose={() => setPanel('none')} />}
      {panel === 'page' && <JumpPagePanel onClose={() => setPanel('none')} />}
    </>
  );
}

function StudentControls({
  onLock,
  scheduleSync,
  syncStatus,
  syncError,
  pushPackNow,
}: {
  onLock: () => void;
  scheduleSync: () => void;
  syncStatus: ReturnType<typeof useTeacherAuth>['syncStatus'];
  syncError: string | null;
  pushPackNow: () => Promise<void>;
}) {
  const { lesson } = useSceneEngine();
  const [expanded, setExpanded] = useState(false);
  const [panel, setPanel] = useState<Panel>('none');
  const [performanceMinimized, setPerformanceMinimized] = useState(false);

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
    reloadFromStorage,
    createClass,
    updateClass,
    removeClass,
    updateAttendance,
    markAllPresent,
    beginNewSession,
    changeFlowers,
    changeClovers,
    commitPick,
    getPickPool,
    patchHistoricalAttendance,
    resumeMeeting,
    resumePreviousMeeting,
    previousTodayId,
  } = useRosterSession(lesson.id, { onPersist: scheduleSync });

  // 解锁 hydrate 已写入 localStorage；挂载时再读一遍，避免闭包旧状态
  useEffect(() => {
    reloadFromStorage();
  }, [reloadFromStorage]);

  const classCounts = useMemo(() => {
    void rosterVersion;
    void classes;
    const map: Record<string, number> = {};
    for (const row of rosterSummary()) map[row.id] = row.count;
    return map;
  }, [rosterVersion, classes]);

  const closePanel = () => {
    setPanel('none');
    setPerformanceMinimized(false);
  };
  const classLabel = classId ? getClassLabel(classId) : '未选班';

  const controls: { label: string; action: () => void }[] = [
    {
      label: '考勤',
      action: () => setPanel('attendance'),
    },
    {
      label: '抽点和主动回答',
      action: () => {
        setPerformanceMinimized(false);
        setPanel('performance');
      },
    },
    {
      label: '访问统计',
      action: () => setPanel('analytics'),
    },
    {
      label: '班级名单',
      action: () => setPanel('roster'),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
          学生管理 · {classLabel} {expanded ? '▴' : '▾'}
        </Button>
        <span
          className={`text-xs ${
            syncStatus === 'error' ? 'text-error' : 'text-text-secondary'
          }`}
          title={syncError ?? undefined}
        >
          {syncLabel(syncStatus)}
        </span>
        {syncStatus === 'error' && (
          <Button variant="ghost" size="sm" type="button" onClick={() => void pushPackNow()}>
            重试同步
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => {
            if (window.confirm('锁定学生管理？考勤、抽点、名单等将需要重新解锁。页面跳转不受影响。')) {
              onLock();
            }
          }}
        >
          锁定
        </Button>
      </div>
      {expanded && (
        <div className="basis-full flex flex-col items-center gap-1.5 pt-1">
          <ClassSwitcher
            classes={classes}
            value={classId}
            onChange={setClassId}
            counts={classCounts}
            size="sm"
          />
          <div className="flex flex-wrap justify-center gap-2">
            {controls.map((c) => (
              <Button key={c.label} variant="secondary" size="sm" onClick={c.action}>
                {c.label}
              </Button>
            ))}
          </div>
        </div>
      )}

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
          onStartNewSession={beginNewSession}
          onPatchHistorical={patchHistoricalAttendance}
          onResumeMeeting={resumeMeeting}
          onResumePrevious={resumePreviousMeeting}
          canResumePrevious={Boolean(previousTodayId)}
          onClose={closePanel}
        />
      )}
      {panel === 'performance' && performanceMinimized && (
        <button
          type="button"
          className="fixed top-20 right-6 z-[70] rounded-full bg-[#12211c] text-white px-5 py-3 text-base shadow-lift"
          onClick={() => setPerformanceMinimized(false)}
        >
          展开抽点和主动回答
        </button>
      )}
      {panel === 'performance' && (
        <div className={performanceMinimized ? 'hidden' : undefined}>
        <PerformancePanel
          classId={classId}
          classes={classes}
          classCounts={classCounts}
          onClassChange={setClassId}
          students={students}
          session={session}
          semester={semester}
          attendanceLog={attendanceLog}
          pool={getPickPool()}
          onManageRoster={() => setPanel('roster')}
          onChangeClovers={changeClovers}
          onChangeFlowers={changeFlowers}
          onPicked={commitPick}
          onMarkEarlyLeave={(id) => updateAttendance(id, 'early_leave')}
          onNeedRoster={() => setPanel(students.length ? 'attendance' : 'roster')}
          onClose={closePanel}
          onMinimize={() => setPerformanceMinimized(true)}
        />
        </div>
      )}
      {panel === 'analytics' && <AnalyticsPanel onClose={closePanel} />}
    </>
  );
}

export function TeacherControls() {
  const auth = useTeacherAuth();
  const [showUnlock, setShowUnlock] = useState(false);

  const unlockButton = auth.unlocked ? (
    <StudentControls
      onLock={() => void auth.lock()}
      scheduleSync={auth.scheduleSync}
      syncStatus={auth.syncStatus}
      syncError={auth.syncError}
      pushPackNow={auth.pushPackNow}
    />
  ) : (
    <Button variant="ghost" size="sm" type="button" onClick={() => setShowUnlock(true)}>
      解锁学生管理
    </Button>
  );

  return (
    <div className="flex flex-col items-center gap-1">
      <PageControls trailing={unlockButton} />
      {!auth.unlocked && showUnlock && (
        <TeacherUnlockPanel
          busy={auth.busy}
          error={auth.error}
          onSubmit={auth.unlock}
          onClose={() => setShowUnlock(false)}
        />
      )}
    </div>
  );
}
