import type { ReactNode } from 'react';
import { useSiteAnalytics } from './useSiteAnalytics';

export function AnalyticsRoot({ children }: { children: ReactNode }) {
  useSiteAnalytics();
  return children;
}
