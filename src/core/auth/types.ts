/**
 * Auth domain types. JWT placeholder — extend with real user/session when implementing.
 */

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated' | 'loading';

export interface AuthUser {
  id: string;
  email?: string;
  /** Display name (from login response or GET /api/me profile.name). */
  displayName?: string;
  /** Account name (from login response or GET /api/me account.name). */
  accountName?: string;
  /** Role from JWT (e.g. "User", "AccountAdministrator"). Used for UI (e.g. show admin menu). */
  role?: string;
  [key: string]: unknown;
}

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  token: string | null;
  setToken: (token: string) => void;
  /** Set session from GET /api/me (e.g. after login when backend uses cookies only). No token stored. */
  setSessionFromMe: (data: import('./meApi').MeResponse) => void;
  /** Update display name and account name (e.g. from login or /api/me). */
  setUserInfo: (displayName: string, accountName?: string) => void;
  logout: () => void;
}
