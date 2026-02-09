import { Link } from 'react-router-dom';
import {
  FaClipboardList,
  FaTruck,
  FaWarehouse,
  FaFileExport,
  FaThLarge,
  FaBoxes,
  FaUser,
} from 'react-icons/fa';
import { useAuthContext } from '@core/auth';
import type { ReactNode } from 'react';
import type { HomePageProps } from '../types';
import './HomePage.css';

/** Shortcut card: icon, label, route. */
const SHORTCUTS: { label: string; path: string; icon: ReactNode; description?: string }[] = [
  { label: 'Solicitudes', path: '/administracion-solicitud', icon: <FaClipboardList /> },
  { label: 'Recolección', path: '/recoleccion', icon: <FaTruck />, description: 'Gestión de recolección' },
  { label: 'Recepción', path: '/recepcion', icon: <FaWarehouse /> },
  { label: 'Reportes', path: '/consulta-reporte', icon: <FaFileExport /> },
  { label: 'Tableros', path: '/consulta-dashboard', icon: <FaThLarge /> },
  { label: 'Inventarios', path: '/administracion-inventario', icon: <FaBoxes /> },
  { label: 'Mi perfil', path: '/profile', icon: <FaUser />, description: 'Datos y preferencias' },
];

/**
 * Dashboard-style home: welcome message and quick-access cards to main areas.
 */
export function HomePage({ title = 'Gresst' }: HomePageProps) {
  const { user } = useAuthContext();
  const displayName = user?.displayName ?? user?.email ?? null;

  return (
    <div className="home-page">
      <header className="home-page__welcome">
        <h1 className="home-page__title">
          {displayName ? (
            <>
              Bienvenido, <span className="home-page__name">{displayName}</span>
            </>
          ) : (
            title
          )}
        </h1>
        <p className="home-page__intro">
          Accesos rápidos a procesos, consultas y administración.
        </p>
      </header>

      <section className="home-page__shortcuts" aria-label="Accesos rápidos">
        <h2 className="home-page__shortcuts-title">Accesos rápidos</h2>
        <ul className="home-page__grid">
          {SHORTCUTS.map(({ label, path, icon, description }) => (
            <li key={path}>
              <Link to={path} className="home-page__card">
                <span className="home-page__card-icon" aria-hidden>
                  {icon}
                </span>
                <span className="home-page__card-label">{label}</span>
                {description && (
                  <span className="home-page__card-desc">{description}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
