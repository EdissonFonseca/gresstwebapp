import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '@core/auth';
import { MainLayout } from '@shared/components/Layout';
import { UserProfilePage } from '../components';
import { useUserProfile } from '../hooks';
import * as profileApi from '../services/profileApi';
import type { UserProfile } from '../types';

vi.mock('../services/profileApi', () => ({
  fetchUserProfile: vi.fn(),
}));

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

describe('User profile feature (integration)', () => {
  const mockProfile: UserProfile = {
    id: '1',
    email: 'integration@example.com',
    displayName: 'Integration User',
  };

  beforeEach(() => {
    vi.mocked(profileApi.fetchUserProfile).mockResolvedValue(mockProfile);
  });

  it('profile route renders layout and loads profile', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/profile" element={<UserProfileRoute />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/Loading/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Integration User')).toBeInTheDocument();
    });

    expect(screen.getByText('integration@example.com')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
  });

  it('shows error and retry updates content', async () => {
    vi.mocked(profileApi.fetchUserProfile)
      .mockRejectedValueOnce(new Error('Fail'))
      .mockResolvedValueOnce(mockProfile);

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/profile" element={<UserProfileRoute />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Fail');
    });

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => {
      expect(screen.getByText('Integration User')).toBeInTheDocument();
    });
  });
});
