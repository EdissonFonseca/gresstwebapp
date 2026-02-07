import type { UserProfilePageProps } from '../types';
import { ProfileCard } from './ProfileCard';
import './UserProfilePage.css';

/**
 * Presentational user profile page. Receives data and callbacks via props.
 */
export function UserProfilePage({
  profile = null,
  isLoading = false,
  error = null,
  onRetry,
}: UserProfilePageProps) {
  if (isLoading) {
    return (
      <div className="user-profile-page" role="status" aria-live="polite">
        <h1>Profile</h1>
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <h1>Profile</h1>
        <p className="user-profile-page__error" role="alert">
          {error}
        </p>
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-profile-page">
        <h1>Profile</h1>
        <p>No profile data.</p>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <h1>Profile</h1>
      <ProfileCard profile={profile} />
    </div>
  );
}
