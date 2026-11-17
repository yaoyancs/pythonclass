import type { LessonHeat, OverviewResult, SummaryResult } from '../analytics/types';
import { TeacherApiError } from './teacherApi';

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (data?.error) return data.error;
  } catch {
    // ignore
  }
  return `请求失败（${res.status}）`;
}

export async function fetchAnalyticsSummary(
  token: string,
  date: string,
  includeTeacher = false,
): Promise<SummaryResult> {
  const q = new URLSearchParams({ date });
  if (includeTeacher) q.set('includeTeacher', '1');
  const res = await fetch(`/api/analytics/summary?${q}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new TeacherApiError(await parseError(res), res.status);
  return (await res.json()) as SummaryResult;
}

export async function fetchAnalyticsOverview(
  token: string,
  includeTeacher = false,
): Promise<OverviewResult> {
  const q = new URLSearchParams();
  if (includeTeacher) q.set('includeTeacher', '1');
  const suffix = q.toString();
  const res = await fetch(`/api/analytics/overview${suffix ? `?${suffix}` : ''}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new TeacherApiError(await parseError(res), res.status);
  return (await res.json()) as OverviewResult;
}

export async function fetchLessonHeat(
  token: string,
  date: string,
  includeTeacher = false,
): Promise<{ date: string; lessons: LessonHeat[] }> {
  const q = new URLSearchParams({ date });
  if (includeTeacher) q.set('includeTeacher', '1');
  const res = await fetch(`/api/analytics/lessons?${q}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new TeacherApiError(await parseError(res), res.status);
  return (await res.json()) as { date: string; lessons: LessonHeat[] };
}
