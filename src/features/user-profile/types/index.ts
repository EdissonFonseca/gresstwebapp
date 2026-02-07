/**
 * User profile feature types.
 */

/** API response from GET /api/me/profile */
export interface ProfileApiResponse {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  status: string;
  isActive: boolean;
  personId?: string;
  lastAccess: string | null;
  createdAt: string;
}

/** Internal/display profile (mapped from API). Only name and email are shown in the UI. */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface UserProfilePageProps {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export type UserProfileState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: UserProfile }
  | { status: 'error'; message: string };
