import { Link } from 'react-router-dom';
import { ROUTES } from '@core/routing';
import type { HomePageProps } from '../types';
import './HomePage.css';

/**
 * Presentational home page. Data and logic come from hooks in the feature.
 */
export function HomePage({ title = 'Gresst WebApp' }: HomePageProps) {
  return (
    <div className="home-page">
      <h1 className="home-page__title">{title}</h1>
      <p className="home-page__intro">
        React + Vite + TypeScript — Feature-Driven structure.
      </p>
      <nav className="home-page__nav" aria-label="Quick links">
        <Link to={ROUTES.userProfile} className="home-page__link">
          Go to Profile
        </Link>
      </nav>
    </div>
  );
}
