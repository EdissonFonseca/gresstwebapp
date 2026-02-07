import type { HomePageProps } from '../types';

/**
 * Home feature hook. Use for data fetching or local state; keep components presentational.
 */
export function useHome(): HomePageProps {
  return { title: 'Gresst WebApp' };
}
