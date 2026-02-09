import {
  downloadApiLogAsFile,
  isApiDebugLogEnabled,
} from '@core/http';
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
        <div className="user-profile-page__actions">
          {onRetry && (
            <button type="button" onClick={onRetry}>
              Retry
            </button>
          )}
          {isApiDebugLogEnabled() ? (
            <button type="button" onClick={downloadApiLogAsFile}>
              Download debug log
            </button>
          ) : (
            <p className="user-profile-page__hint">
              Set VITE_DEBUG_API_LOG=true in .env and retry to capture a debug log file.
            </p>
          )}
        </div>
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
