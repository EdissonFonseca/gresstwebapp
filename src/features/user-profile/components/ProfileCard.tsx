import type { ReactNode } from 'react';
import { useState } from 'react';
import type { UpdateProfilePayload, UserProfile } from '../types';
import { ProfileField } from './ProfileField';

interface ProfileCardProps {
  profile: UserProfile;
  actions?: ReactNode;
  onSave?: (payload: UpdateProfilePayload) => Promise<void>;
}

/**
 * Card displaying user profile. Shows first name, last name, email.
 * When onSave is provided, shows Edit button and inline form to save changes via PUT me/profile.
 */
export function ProfileCard({ profile, actions, onSave }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);

  const startEditing = () => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setSaveError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;
    setSaveError(null);
    setSaving(true);
    try {
      await onSave({ firstName: firstName.trim(), lastName: lastName.trim(), email: profile.email });
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const initial = (profile.firstName?.charAt(0) || profile.displayName?.charAt(0) || '?').toUpperCase();

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
          {initial}
        </div>
      )}
      {isEditing ? (
        <form className="profile-card__form" onSubmit={handleSubmit}>
          <div className="profile-card__fields">
            <div className="profile-field">
              <label htmlFor="profile-firstName" className="profile-field__label">
                First name
              </label>
              <input
                id="profile-firstName"
                type="text"
                className="profile-field__input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                disabled={saving}
              />
            </div>
            <div className="profile-field">
              <label htmlFor="profile-lastName" className="profile-field__label">
                Last name
              </label>
              <input
                id="profile-lastName"
                type="text"
                className="profile-field__input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                disabled={saving}
              />
            </div>
            <div className="profile-field">
              <span className="profile-field__label">Email</span>
              <span className="profile-field__value profile-field__value--readonly">{profile.email || '—'}</span>
            </div>
          </div>
          {saveError && (
            <p className="profile-card__save-error" role="alert">
              {saveError}
            </p>
          )}
          <div className="profile-card__form-actions">
            <button type="button" onClick={cancelEditing} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <dl className="profile-card__fields">
            <ProfileField label="First name" value={profile.firstName || '—'} />
            <ProfileField label="Last name" value={profile.lastName || '—'} />
            <ProfileField label="Email" value={profile.email || '—'} />
          </dl>
          {(onSave || actions) && (
            <div className="profile-card__actions">
              {onSave && (
                <button type="button" onClick={startEditing}>
                  Edit
                </button>
              )}
              {actions}
            </div>
          )}
        </>
      )}
    </article>
  );
}

