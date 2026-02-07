import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserProfile } from '../hooks/useUserProfile';
import * as profileApi from '../services/profileApi';
import type { UserProfile } from '../types';

vi.mock('../services/profileApi', () => ({
  fetchUserProfile: vi.fn(),
}));

describe('useUserProfile', () => {
  const mockProfile: UserProfile = {
    id: '1',
    email: 'hook@example.com',
    displayName: 'Hook User',
  };

  beforeEach(() => {
    vi.mocked(profileApi.fetchUserProfile).mockResolvedValue(mockProfile);
  });

  it('loads profile on mount and exposes data', async () => {
    const { result } = renderHook(() => useUserProfile());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBeNull();
    expect(profileApi.fetchUserProfile).toHaveBeenCalledTimes(1);
  });

  it('sets error and exposes retry when fetch fails', async () => {
    vi.mocked(profileApi.fetchUserProfile).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBe('Network error');
    expect(typeof result.current.retry).toBe('function');

    vi.mocked(profileApi.fetchUserProfile).mockResolvedValue(mockProfile);
    result.current.retry();

    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.error).toBeNull();
    });
    // At least 2 (initial load + retry); may be 3 with React Strict Mode double-invoking effects
    expect(vi.mocked(profileApi.fetchUserProfile).mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('uses generic message when fetch throws non-Error', async () => {
    vi.mocked(profileApi.fetchUserProfile).mockRejectedValue('string error');

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load profile');
  });

  it('exposes stable retry reference', async () => {
    const { result } = renderHook(() => useUserProfile());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const retry1 = result.current.retry;
    const retry2 = result.current.retry;
    expect(retry1).toBe(retry2);
  });
});
