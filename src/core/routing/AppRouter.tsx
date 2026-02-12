import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@shared/components/Layout';
import { useAuthContext } from '@core/auth';
import { LoginPage } from '@features/auth';
import { ChangePasswordPage } from '@features/change-password';
import { HomePage, useHome } from '@features/home';
import { UserProfilePage, useUserProfile } from '@features/user-profile';
import { ROUTES } from './routes';
import { NotFoundPage } from './NotFoundPage';
import { RequireAuth } from './RequireAuth';
import { RouteErrorBoundary } from './RouteErrorBoundary';

function HomeRoute() {
  const { title } = useHome();
  return <HomePage title={title} />;
}

function UserProfileRoute() {
  const { profile, isLoading, error, retry, saveProfile } = useUserProfile();
  return (
    <UserProfilePage
      profile={profile}
      isLoading={isLoading}
      error={error}
      onRetry={retry}
      onSaveProfile={saveProfile}
    />
  );
}

/**
 * Root route (/): auth tries session first (fetchMe with credentials; 401 → refresh → retry).
 * Only when session cannot be established we show login. Supports entry from external redirect (cookies).
 */
function RootRoute() {
  const { status } = useAuthContext();

  if (status === 'unauthenticated') {
    return <LoginPage />;
  }

  if (status === 'loading') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }} aria-busy="true">
        Cargando…
      </div>
    );
  }

  return (
    <MainLayout>
      <HomeRoute />
    </MainLayout>
  );
}

function LoginRoute() {
  const { status } = useAuthContext();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') ?? ROUTES.home;

  if (status === 'authenticated') {
    return <Navigate to={returnUrl} replace />;
  }

  if (status === 'loading') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }} aria-busy="true">
        Cargando…
      </div>
    );
  }

  return <LoginPage />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.home} element={<RootRoute />} />
        <Route path={ROUTES.login} element={<LoginRoute />} />
        <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
          <Route
            path={ROUTES.userProfile}
            element={
              <RouteErrorBoundary>
                <UserProfileRoute />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/user-profile"
            element={
              <RouteErrorBoundary>
                <UserProfileRoute />
              </RouteErrorBoundary>
            }
          />
          <Route
            path={ROUTES.changePassword}
            element={
              <RouteErrorBoundary>
                <ChangePasswordPage />
              </RouteErrorBoundary>
            }
          />
          <Route path={ROUTES.notFound} element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
