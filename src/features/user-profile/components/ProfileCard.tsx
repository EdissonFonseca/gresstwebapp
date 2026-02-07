import type { ReactNode } from 'react';
import type { UserProfile } from '../types';
import { ProfileField } from './ProfileField';

interface ProfileCardProps {
  profile: UserProfile;
  actions?: ReactNode;
}

/**
 * Presentational card displaying user profile. Data via props.
 */
export function ProfileCard({ profile, actions }: ProfileCardProps) {
  return (
    <article className="profile-card" aria-label="User profile">
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt=""
          className="profile-card__avatar"
          width={80}
          height={80}
        />
      ) : (
        <div className="profile-card__avatar-placeholder" aria-hidden>
          {(profile.displayName ?? '').charAt(0).toUpperCase() || '?'}
        </div>
      )}
      <dl className="profile-card__fields">
        <ProfileField label="Name" value={profile.displayName} />
        <ProfileField label="Email" value={profile.email} />
      </dl>
      {actions ? <div className="profile-card__actions">{actions}</div> : null}
    </article>
  );
}

