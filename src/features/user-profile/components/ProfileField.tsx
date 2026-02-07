import type { ReactNode } from 'react';

interface ProfileFieldProps {
  label: string;
  value: ReactNode;
}

/**
 * Presentational field: label + value. No business logic.
 */
export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="profile-field">
      <dt className="profile-field__label">{label}</dt>
      <dd className="profile-field__value">{value}</dd>
    </div>
  );
}
