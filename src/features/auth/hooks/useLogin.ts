import { useCallback, useState } from 'react';
import { useAuthContext } from '@core/auth';
import { login as loginApi } from '../services/loginApi';

export interface UseLoginResult {
  submit: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useLogin(): UseLoginResult {
  const { setToken, setUserInfo } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const submit = useCallback(
    async (username: string, password: string) => {
      setError(null);
      setIsLoading(true);
      try {
        const res = await loginApi({ Username: username.trim(), Password: password });
        if (!res.success || !res.accessToken) {
          setError(res.error ?? 'Login failed');
          return;
        }
        setToken(res.accessToken);
        const displayName = res.name?.trim() ?? '';
        const accountName = res.accountName?.trim() ?? '';
        if (displayName || accountName) {
          setUserInfo(displayName, accountName);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Login failed';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [setToken, setUserInfo]
  );

  return { submit, isLoading, error, clearError };
}
