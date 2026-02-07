import type { HomePageProps } from '../types';

/**
 * Presentational home page. Data and logic come from hooks in the feature.
 */
export function HomePage({ title = 'Gresst WebApp' }: HomePageProps) {
  return (
    <div>
      <h1>{title}</h1>
      <p>React + Vite + TypeScript — Feature-Driven structure.</p>
    </div>
  );
}
