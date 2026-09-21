import { json, type TeacherEnv } from '../teacher/_shared';
import {
  allowRate,
  classifyDevice,
  parseIncomingHit,
  RATE_LIMIT_PER_MIN,
  type IncomingHit,
} from './_logic';
import { insertHit } from './_db';

type PagesContext = {
  request: Request;
  env: TeacherEnv;
};

const buckets = new Map<string, number[]>();

function clientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;
  const ip = clientIp(request);
  const now = Date.now();
  const gated = allowRate(buckets.get(ip) ?? [], now, RATE_LIMIT_PER_MIN);
  buckets.set(ip, gated.next);
  if (!gated.ok) {
    return json({ error: '请求过于频繁' }, 429);
  }

  if (!env.ANALYTICS_DB) {
    return json({ error: '未绑定 ANALYTICS_DB' }, 503);
  }

  let body: IncomingHit;
  try {
    body = (await request.json()) as IncomingHit;
  } catch {
    return json({ error: '请求格式错误' }, 400);
  }

  const parsed = parseIncomingHit(body, {
    ip,
    device: classifyDevice(
      request.headers.get('user-agent') || '',
      request.headers.get('sec-ch-ua-mobile'),
    ),
  });

  if (!parsed.ok) {
    if (parsed.drop) return new Response(null, { status: 204 });
    return json({ error: parsed.error }, 400);
  }

  try {
    await insertHit(env.ANALYTICS_DB, parsed.hit);
  } catch {
    return json({ error: '写入失败' }, 503);
  }

  return new Response(null, { status: 204 });
};
