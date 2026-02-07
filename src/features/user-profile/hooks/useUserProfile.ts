import { useCallback, useEffect, useState } from 'react';
import { fetchUserProfile } from '../services';
import type { UserProfile, UserProfileState } from '../types';

function isErrorState(state: UserProfileState): state is { status: 'error'; message: string } {
  return state.status === 'error';
}

function isSuccessState(
  state: UserProfileState
): state is { status: 'success'; data: UserProfile } {
  return state.status === 'success';
}

export function useUserProfile() {
  const [state, setState] = useState<UserProfileState>({ status: 'loading' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const data = await fetchUserProfile();
      if (
        typeof data !== 'object' ||
        data === null ||
        typeof (data as UserProfile).displayName !== 'string' ||
        typeof (data as UserProfile).email !== 'string'
      ) {
        setState({ status: 'error', message: 'Invalid response from server' });
        return;
      }
      setState({ status: 'success', data: data as UserProfile });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      setState({ status: 'error', message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const profile = isSuccessState(state) ? state.data : null;
  const isLoading = state.status === 'loading';
  const error = isErrorState(state) ? state.message : null;

  return {
    profile,
    isLoading,
    error,
    retry: load,
  };
}
