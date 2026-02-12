import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AUTH_UNAUTHORIZED_EVENT } from '@core/http/errors';
import { getUseCredentials } from '@core/config/runtimeConfig';
import { fetchMe } from './meApi';
import type { MeResponse } from './meApi';
import { clearStoredToken, getStoredToken, setStoredToken } from './storage';
import { parseUserFromToken } from './jwt';
import type { AuthState, AuthUser } from './types';

const AuthContext = createContext<AuthState | null>(null);

function userFromMeResponse(data: MeResponse): AuthUser {
  const name = data.profile?.name?.trim() ?? '';
  const accountName = data.account?.name?.trim() ?? '';
  return {
    id: data.profile?.id ?? 'unknown',
    email: data.profile?.email,
    displayName: name || undefined,
    accountName: accountName || undefined,
  };
}

function deriveStatus(
  token: string | null,
  user: AuthState['user'],
  cookieSessionValid: boolean,
  checkingCookieSession: boolean
): AuthState['status'] {
  if (checkingCookieSession) return 'loading';
  if (token) return user ? 'authenticated' : 'loading';
  if (cookieSessionValid) return user ? 'authenticated' : 'loading';
  return 'unauthenticated';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const useCredentials = getUseCredentials();
  const [token, setTokenState] = useState<string | null>(() =>
    useCredentials ? null : getStoredToken()
  );
  const [user, setUser] = useState<AuthState['user']>(null);
  const [cookieSessionValid, setCookieSessionValid] = useState(false);
  // In credentials mode with no token we probe session (fetchMe). Start as "checking" so we show loading
  // until the probe runs—avoids redirect to login on direct hit to e.g. /user-profile before fetchMe runs.
  const [checkingCookieSession, setCheckingCookieSession] = useState(() =>
    useCredentials && !getStoredToken()
  );
  const cookieCheckDone = useRef(false);

  const setToken = useCallback((newToken: string) => {
    setStoredToken(newToken);
    setTokenState(newToken);
    const parsed = parseUserFromToken(newToken);
    setUser(parsed ?? { id: 'unknown', email: undefined });
  }, []);

  /** Set session from GET /api/me (cookie-only flow: no token stored). */
  const setSessionFromMe = useCallback((data: MeResponse) => {
    setCookieSessionValid(true);
    setUser(userFromMeResponse(data));
  }, []);

  const setUserInfo = useCallback((displayName: string, accountName?: string) => {
    setUser((prev) =>
      prev
        ? { ...prev, displayName: displayName.trim() || prev.displayName, accountName: accountName?.trim() || prev.accountName }
        : null
    );
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setTokenState(null);
    setUser(null);
    setCookieSessionValid(false);
  }, []);

  // When not using credentials, sync token from storage on mount (e.g. new tab)
  useEffect(() => {
    if (useCredentials) return;
    const stored = getStoredToken();
    if (stored) {
      setTokenState(stored);
      const parsed = parseUserFromToken(stored);
      setUser(parsed ?? { id: 'unknown', email: undefined });
    }
  }, [useCredentials]);

  // Cookie-only: probe session with fetchMe (browser sends cookies). 401 → refresh → retry in HTTP client.
  useEffect(() => {
    if (token !== null || !useCredentials || cookieCheckDone.current) return;
    cookieCheckDone.current = true;
    setCheckingCookieSession(true);
    fetchMe()
      .then((data) => {
        setCookieSessionValid(true);
        setUser(userFromMeResponse(data));
      })
      .catch(() => {
        // 401 after refresh → auth:unauthorized will have fired; stay unauthenticated
      })
      .finally(() => {
        setCheckingCookieSession(false);
      });
  }, [token, useCredentials]);

  // When we have a token, fetch /api/me for display names
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchMe()
      .then((data) => {
        if (cancelled) return;
        const displayName = data.profile?.name?.trim() ?? '';
        const accountName = data.account?.name?.trim() ?? '';
        if (displayName || accountName) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  ...(displayName && { displayName }),
                  ...(accountName && { accountName }),
                }
              : null
          );
        }
      })
      .catch(() => {
        // Keep user from JWT; names may stay from login or remain undefined
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handler);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handler);
  }, [logout]);

  const status = deriveStatus(token, user, cookieSessionValid, checkingCookieSession);
  const value: AuthState = {
    status,
    user,
    token,
    setToken,
    setSessionFromMe,
    setUserInfo,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
