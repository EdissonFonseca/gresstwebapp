import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from '@core/http';
import { fetchUserProfile } from '../services/profileApi';
import type { ProfileApiResponse } from '../types';

vi.mock('@core/http', () => ({
  get: vi.fn(),
}));

const mockApiResponse: ProfileApiResponse = {
  id: '1',
  accountId: '3',
  firstName: 'Test',
  lastName: 'User',
  name: 'Test User',
  email: 'test@example.com',
  status: 'A',
  isActive: true,
  lastAccess: null,
  createdAt: '2026-02-07T18:55:43.6315281Z',
};

describe('profileApi', () => {
  beforeEach(() => {
    vi.mocked(get).mockReset();
  });

  it('calls GET /api/me/profile and maps response to UserProfile', async () => {
    vi.mocked(get).mockResolvedValue(mockApiResponse);

    const result = await fetchUserProfile();

    expect(get).toHaveBeenCalledWith('/api/me/profile');
    expect(result).toEqual({
      id: '1',
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: mockApiResponse.createdAt,
    });
  });

  it('propagates HTTP errors', async () => {
    vi.mocked(get).mockRejectedValue(new Error('Unauthorized'));

    await expect(fetchUserProfile()).rejects.toThrow('Unauthorized');
  });

  it('trims name from API', async () => {
    vi.mocked(get).mockResolvedValue({ ...mockApiResponse, name: '  Blanca Barrera  ' });

    const result = await fetchUserProfile();

    expect(result.displayName).toBe('Blanca Barrera');
  });
});
