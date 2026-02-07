/**
 * User profile feature types.
 */

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
