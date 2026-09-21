import { useCallback, useRef, useState } from 'react';
import {
  clearTeacherToken,
  fetchTeacherPack,
  loadTeacherToken,
  saveTeacherPack,
  saveTeacherToken,
  teacherLogin,
  teacherLogout,
  TeacherApiError,
} from '../api/teacherApi';
import {
  exportTeacherPack,
  importTeacherPack,
  packHasTeachingData,
} from '../utils/rosterStorage';
import type { TeacherCloudPack } from '../types/teacherPack';

export type CloudSyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export function useTeacherAuth() {
  const [unlocked, setUnlocked] = useState(() => !!loadTeacherToken());
  const [token, setToken] = useState<string | null>(() => loadTeacherToken());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const syncTimer = useRef<number | null>(null);
  const lastFailAlertAt = useRef(0);

  const hydrateFromCloud = useCallback(async (sessionToken: string) => {
    const remote = await fetchTeacherPack(sessionToken);
    if (packHasTeachingData(remote)) {
      importTeacherPack(remote as TeacherCloudPack);
      return;
    }
    // 云端空：若本机已有数据则上传作为种子
    const local = exportTeacherPack();
    if (packHasTeachingData(local)) {
      await saveTeacherPack(sessionToken, local);
    }
  }, []);

  const unlock = useCallback(
    async (pin: string) => {
      setBusy(true);
      setError(null);
      try {
        const { token: nextToken } = await teacherLogin(pin.trim());
        await hydrateFromCloud(nextToken);
        saveTeacherToken(nextToken);
        setToken(nextToken);
        setUnlocked(true);
        setSyncStatus('synced');
        setSyncError(null);
        return true;
      } catch (err) {
        const message =
          err instanceof TeacherApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : '解锁失败';
        setError(message);
        clearTeacherToken();
        setToken(null);
        setUnlocked(false);
        window.alert(`教师台解锁失败：${message}`);
        return false;
      } finally {
        setBusy(false);
      }
    },
    [hydrateFromCloud],
  );

  const lock = useCallback(async () => {
    const current = token ?? loadTeacherToken();
    if (current) await teacherLogout(current);
    clearTeacherToken();
    setToken(null);
    setUnlocked(false);
    setSyncStatus('idle');
    setSyncError(null);
    setError(null);
    if (syncTimer.current != null) {
      window.clearTimeout(syncTimer.current);
      syncTimer.current = null;
    }
  }, [token]);

  const pushPackNow = useCallback(async () => {
    const sessionToken = token ?? loadTeacherToken();
    if (!sessionToken) return;
    setSyncStatus('syncing');
    setSyncError(null);
    try {
      const pack = exportTeacherPack();
      await saveTeacherPack(sessionToken, pack);
      setSyncStatus('synced');
    } catch (err) {
      const message =
        err instanceof TeacherApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : '云端同步失败';
      setSyncStatus('error');
      setSyncError(message);
      if (err instanceof TeacherApiError && err.status === 401) {
        clearTeacherToken();
        setToken(null);
        setUnlocked(false);
        window.alert('教师登录已失效，请重新输入 PIN。');
        return;
      }
      const now = Date.now();
      if (now - lastFailAlertAt.current > 8000) {
        lastFailAlertAt.current = now;
        window.alert(`云端保存失败：${message}\n本机改动仍保留，网络恢复后会再试。`);
      }
    }
  }, [token]);

  const scheduleSync = useCallback(() => {
    if (!(token ?? loadTeacherToken())) return;
    if (syncTimer.current != null) window.clearTimeout(syncTimer.current);
    syncTimer.current = window.setTimeout(() => {
      syncTimer.current = null;
      void pushPackNow();
    }, 600);
  }, [pushPackNow, token]);

  return {
    unlocked,
    token,
    busy,
    error,
    syncStatus,
    syncError,
    unlock,
    lock,
    scheduleSync,
    pushPackNow,
  };
}
