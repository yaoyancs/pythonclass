import { json, requireTeacherSession, type TeacherEnv } from '../teacher/_shared';
import { buildLessonHeat, isValidDateYmd, shanghaiDate, shanghaiDayUtcRange } from './_logic';
import { loadHitsInRange } from './_db';

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
  const dateParam = url.searchParams.get('date')?.trim() || shanghaiDate(new Date());
  if (!isValidDateYmd(dateParam)) {
    return json({ error: '日期格式无效' }, 400);
  }

  const { startIso, endIso } = shanghaiDayUtcRange(dateParam);
  const excludeTeacher = url.searchParams.get('includeTeacher') !== '1';
  try {
    const hits = await loadHitsInRange(env.ANALYTICS_DB, startIso, endIso);
    return json({ date: dateParam, lessons: buildLessonHeat(hits, excludeTeacher) });
  } catch (err) {
    console.error('analytics lessons', err);
    return json({ error: '读取失败' }, 503);
  }
};
