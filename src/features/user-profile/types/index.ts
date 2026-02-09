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

/** Internal/display profile (mapped from API). */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  createdAt?: string;
}

/** Payload for PUT /api/me/profile */
export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserProfilePageProps {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onSaveProfile?: (payload: UpdateProfilePayload) => Promise<void>;
}

export type UserProfileState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: UserProfile }
  | { status: 'error'; message: string };
