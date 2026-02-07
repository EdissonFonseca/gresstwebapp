/**
 * Auth domain types. JWT placeholder — extend with real user/session when implementing.
 */

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated' | 'loading';

export interface AuthUser {
  id: string;
  email?: string;
  [key: string]: unknown;
}

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}
