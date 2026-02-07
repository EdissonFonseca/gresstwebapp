import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AUTH_UNAUTHORIZED_EVENT } from '@core/http/errors';
import { clearStoredToken, getStoredToken, setStoredToken } from './storage';
import { parseUserFromToken } from './jwt';
import type { AuthState } from './types';

const AuthContext = createContext<AuthState | null>(null);

function deriveStatus(token: string | null, user: AuthState['user']): AuthState['status'] {
  if (token) return user ? 'authenticated' : 'loading';
  return 'unauthenticated';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthState['user']>(null);

  const setToken = useCallback((newToken: string) => {
    setStoredToken(newToken);
    setTokenState(newToken);
    const parsed = parseUserFromToken(newToken);
    setUser(parsed ?? { id: 'unknown', email: undefined });
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setTokenState(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const stored = getStoredToken();
    if (stored) {
      setTokenState(stored);
      const parsed = parseUserFromToken(stored);
      setUser(parsed ?? { id: 'unknown', email: undefined });
    }
  }, []);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handler);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handler);
  }, [logout]);

  const status = deriveStatus(token, user);
  const value: AuthState = {
    status,
    user,
    token,
    setToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
