import { json, requireTeacherSession, type TeacherEnv } from '../teacher/_shared';
import { shanghaiLast7Range, shapeOverview } from './_logic';
import { loadOverview } from './_db';

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
  const excludeTeacher = url.searchParams.get('includeTeacher') !== '1';
  const range = shanghaiLast7Range(new Date());
  try {
    const aggregates = await loadOverview(env.ANALYTICS_DB, {
      includeTeacher: !excludeTeacher,
      last7Start: range.startIso,
      last7End: range.endIso,
    });
    return json(
      shapeOverview({
        excludeTeacher,
        days: range.days,
        ...aggregates,
      }),
    );
  } catch (err) {
    console.error('analytics overview', err);
    return json({ error: '读取失败' }, 503);
  }
};
