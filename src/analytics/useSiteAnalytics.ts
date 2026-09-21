import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackSessionStart } from './client';

/** 首页与 SPA 换页：会话开始 + 路径，不阻塞渲染 */
export function useSiteAnalytics(): void {
  const location = useLocation();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    trackSessionStart(`${location.pathname}${location.search}` || '/');
  }, [location.pathname]);
}
