import type { AnalyticsFilterRange, LessonHeat, OverviewResult, SummaryResult } from '../analytics/types';
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

function buildRangeQuery(filter: string | AnalyticsFilterRange, includeTeacher: boolean): URLSearchParams {
  const q = new URLSearchParams();
  if (typeof filter === 'string') {
    q.set('date', filter);
  } else if (filter.mode === 'day') {
    q.set('date', filter.date);
  } else if (filter.mode === 'last7') {
    q.set('range', 'last7');
  } else if (filter.mode === 'all') {
    q.set('range', 'all');
  } else {
    q.set('start', filter.start);
    q.set('end', filter.end);
  }
  if (includeTeacher) q.set('includeTeacher', '1');
  return q;
}

export async function fetchAnalyticsSummary(
  token: string,
  filter: string | AnalyticsFilterRange,
  includeTeacher = false,
): Promise<SummaryResult> {
  const q = buildRangeQuery(filter, includeTeacher);
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
  filter: string | AnalyticsFilterRange,
  includeTeacher = false,
): Promise<{ date: string; truncated?: boolean; lessons: LessonHeat[] }> {
  const q = buildRangeQuery(filter, includeTeacher);
  const res = await fetch(`/api/analytics/lessons?${q}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new TeacherApiError(await parseError(res), res.status);
  return (await res.json()) as { date: string; truncated?: boolean; lessons: LessonHeat[] };
}
