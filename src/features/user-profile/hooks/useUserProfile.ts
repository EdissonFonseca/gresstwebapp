import { useCallback, useEffect, useState } from 'react';
import { fetchUserProfile, updateUserProfile } from '../services';
import type { UpdateProfilePayload, UserProfile, UserProfileState } from '../types';

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
        typeof data.email !== 'string' ||
        typeof data.firstName !== 'string' ||
        typeof data.lastName !== 'string'
      ) {
        setState({ status: 'error', message: 'Invalid response from server' });
        return;
      }
      setState({ status: 'success', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      setState({ status: 'error', message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveProfile = useCallback(async (payload: UpdateProfilePayload) => {
    if (!isSuccessState(state)) return;
    try {
      const data = await updateUserProfile(payload);
      setState({ status: 'success', data });
    } catch (err) {
      throw err;
    }
  }, [state]);

  const profile = isSuccessState(state) ? state.data : null;
  const isLoading = state.status === 'loading';
  const error = isErrorState(state) ? state.message : null;

  return {
    profile,
    isLoading,
    error,
    retry: load,
    saveProfile,
  };
}
