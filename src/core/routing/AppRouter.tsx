import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@shared/components/Layout';
import { HomePage, useHome } from '@features/home';
import { UserProfilePage, useUserProfile } from '@features/user-profile';
import { ROUTES } from './routes';
import { NotFoundPage } from './NotFoundPage';
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

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
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
