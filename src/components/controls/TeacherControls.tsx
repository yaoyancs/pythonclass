import { useEffect, useMemo, useState } from 'react';
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

type Panel = 'none' | 'lesson' | 'page' | 'attendance' | 'performance' | 'roster' | 'analytics';

function syncLabel(status: ReturnType<typeof useTeacherAuth>['syncStatus']): string {
  if (status === 'syncing') return '同步中…';
  if (status === 'synced') return '已同步云端';
  if (status === 'error') return '云端同步失败';
  return '';
}

function TeacherControlsUnlocked({
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
  const { lesson, dispatch } = useSceneEngine();
  const [expanded, setExpanded] = useState(true);
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
      label: '考勤',
      action: () => setPanel('attendance'),
    },
    {
      label: '提问与互动',
      action: () => setPanel('performance'),
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
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="ghost" size="md" onClick={() => setExpanded((v) => !v)}>
          教师控制台 · {classLabel} {expanded ? '▴' : '▾'}
        </Button>
        <span
          className={`text-sm ${
            syncStatus === 'error' ? 'text-error' : 'text-text-secondary'
          }`}
          title={syncError ?? undefined}
        >
          {syncLabel(syncStatus)}
        </span>
        {syncStatus === 'error' && (
          <Button variant="ghost" size="md" type="button" onClick={() => void pushPackNow()}>
            重试同步
          </Button>
        )}
        <Button
          variant="ghost"
          size="md"
          type="button"
          onClick={() => {
            if (window.confirm('锁定教师台？本页将隐藏提问与互动（抽点/幸运草）等操作。')) {
              onLock();
            }
          }}
        >
          锁定
        </Button>
      </div>
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
          onStartNewSession={beginNewSession}
          onPatchHistorical={patchHistoricalAttendance}
          onResumeMeeting={resumeMeeting}
          onResumePrevious={resumePreviousMeeting}
          canResumePrevious={Boolean(previousTodayId)}
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
          attendanceLog={attendanceLog}
          pool={getPickPool()}
          onManageRoster={() => setPanel('roster')}
          onChangeClovers={changeClovers}
          onChangeFlowers={changeFlowers}
          onPicked={commitPick}
          onMarkEarlyLeave={(id) => updateAttendance(id, 'early_leave')}
          onNeedRoster={() => setPanel(students.length ? 'attendance' : 'roster')}
          onClose={closePanel}
        />
      )}
      {panel === 'analytics' && <AnalyticsPanel onClose={closePanel} />}
    </div>
  );
}

export function TeacherControls() {
  const auth = useTeacherAuth();
  const [showUnlock, setShowUnlock] = useState(false);

  if (!auth.unlocked) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button variant="ghost" size="md" type="button" onClick={() => setShowUnlock(true)}>
          教师解锁
        </Button>
        {showUnlock && (
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

  return (
    <TeacherControlsUnlocked
      onLock={() => void auth.lock()}
      scheduleSync={auth.scheduleSync}
      syncStatus={auth.syncStatus}
      syncError={auth.syncError}
      pushPackNow={auth.pushPackNow}
    />
  );
}
