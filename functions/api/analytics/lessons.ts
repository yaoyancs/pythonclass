import { json, requireTeacherSession, type TeacherEnv } from '../teacher/_shared';
import { buildLessonHeat, resolveQueryRange } from './_logic';
import { loadHitsWindow } from './_db';

type PagesContext = {
  request: Request;
  env: TeacherEnv;
};

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;
  const denied = await requireTeacherSession(request, env);
  if (denied) return denied;

  if (!env.ANALYTICS_DB) {
    return json({ error: '未绑定 ANALYTICS_DB' }, 503);
  }

  const url = new URL(request.url);
  const resolved = resolveQueryRange(url.searchParams);
  if (!resolved.ok) {
    return json({ error: resolved.error }, 400);
  }

  const excludeTeacher = url.searchParams.get('includeTeacher') !== '1';
  try {
    const { hits, truncated } = await loadHitsWindow(
      env.ANALYTICS_DB,
      resolved.startIso,
      resolved.endIso,
    );
    return json({
      date: resolved.label,
      truncated,
      lessons: buildLessonHeat(hits, excludeTeacher),
    });
  } catch (err) {
    console.error('analytics lessons', err);
    return json({ error: '读取失败' }, 503);
  }
};
