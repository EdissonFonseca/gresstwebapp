import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfilePage } from '../components/UserProfilePage';
import type { UserProfile } from '../types';

const mockProfile: UserProfile = {
  id: '1',
  email: 'user@example.com',
  displayName: 'Test User',
};

describe('UserProfilePage', () => {
  it('renders loading state', () => {
    render(
      <UserProfilePage profile={null} isLoading={true} error={null} />
    );
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('renders error state with retry', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <UserProfilePage
        profile={null}
        isLoading={false}
        error="Network error"
        onRetry={onRetry}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when no profile', () => {
    render(
      <UserProfilePage profile={null} isLoading={false} error={null} />
    );
    expect(screen.getByText('No profile data.')).toBeInTheDocument();
  });

  it('renders profile when data is provided', () => {
    render(
      <UserProfilePage
        profile={mockProfile}
        isLoading={false}
        error={null}
      />
    );
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('does not render Retry button when onRetry is not provided', () => {
    render(
      <UserProfilePage
        profile={null}
        isLoading={false}
        error="Something went wrong"
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  it('loading state has role="status" for screen readers', () => {
    render(
      <UserProfilePage profile={null} isLoading={true} error={null} />
    );
    expect(screen.getByRole('status')).toHaveTextContent(/Loading/);
  });
});
