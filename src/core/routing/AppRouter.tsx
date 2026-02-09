import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@shared/components/Layout';
import { useAuthContext } from '@core/auth';
import { LoginPage } from '@features/auth';
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
  const { profile, isLoading, error, retry } = useUserProfile();
  return (
    <UserProfilePage
      profile={profile}
      isLoading={isLoading}
      error={error}
      onRetry={retry}
    />
  );
}

function LoginRoute() {
  const { status } = useAuthContext();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') ?? ROUTES.userProfile;

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
        <Route path={ROUTES.login} element={<LoginRoute />} />
        <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
          <Route path={ROUTES.home} element={<HomeRoute />} />
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
          <Route path={ROUTES.notFound} element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
