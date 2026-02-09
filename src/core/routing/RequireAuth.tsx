import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@core/auth';
import { ROUTES } from './routes';

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * If the user is not authenticated, redirect to login with returnUrl so they can
 * be sent back to the requested page after logging in.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const { status } = useAuthContext();
  const location = useLocation();

  if (status === 'unauthenticated') {
    const returnUrl = location.pathname + location.search;
    const search = returnUrl && returnUrl !== ROUTES.home ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '';
    return <Navigate to={`${ROUTES.login}${search}`} replace state={{ from: location }} />;
  }

  if (status === 'loading') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }} aria-busy="true">
        Cargando…
      </div>
    );
  }

  return <>{children}</>;
}
