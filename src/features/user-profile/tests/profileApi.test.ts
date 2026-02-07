import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from '@core/http';
import { fetchUserProfile } from '../services/profileApi';
import type { UserProfile } from '../types';

vi.mock('@core/http', () => ({
  get: vi.fn(),
}));

describe('profileApi', () => {
  beforeEach(() => {
    vi.mocked(get).mockReset();
  });

  it('calls GET /api/profile and returns UserProfile', async () => {
    const mockProfile: UserProfile = {
      id: '1',
      email: 'test@example.com',
      displayName: 'Test User',
    };
    vi.mocked(get).mockResolvedValue(mockProfile);

    const result = await fetchUserProfile();

    expect(get).toHaveBeenCalledWith('/api/profile');
    expect(result).toEqual(mockProfile);
  });

  it('propagates HTTP errors', async () => {
    vi.mocked(get).mockRejectedValue(new Error('Unauthorized'));

    await expect(fetchUserProfile()).rejects.toThrow('Unauthorized');
  });

  it('uses correct endpoint', async () => {
    vi.mocked(get).mockResolvedValue({ id: '1', email: 'e@e.com', displayName: 'D' });

    await fetchUserProfile();

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('/api/profile');
  });
});
