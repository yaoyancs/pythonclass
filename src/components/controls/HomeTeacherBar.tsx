import { useState } from 'react';
import { useTeacherAuth } from '../../hooks/useTeacherAuth';
import { Button } from '../ui/Button';
import { AnalyticsPanel } from './AnalyticsPanel';
import { TeacherUnlockPanel } from './TeacherUnlockPanel';

/** 首页教师入口：解锁 + 访问统计（不依赖课堂引擎） */
export function HomeTeacherBar() {
  const auth = useTeacherAuth();
  const [showUnlock, setShowUnlock] = useState(false);
  const [showStats, setShowStats] = useState(false);

  if (!auth.unlocked) {
    return (
      <div className="flex items-center gap-2">
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
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="md" type="button" onClick={() => setShowStats(true)}>
        访问统计
      </Button>
      <Button
        variant="ghost"
        size="md"
        type="button"
        onClick={() => {
          if (window.confirm('锁定教师台？')) void auth.lock();
        }}
      >
        锁定
      </Button>
      {showStats && <AnalyticsPanel onClose={() => setShowStats(false)} />}
    </div>
  );
}
