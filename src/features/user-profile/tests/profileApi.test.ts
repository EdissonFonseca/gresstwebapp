import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get, put } from '@core/http';
import { fetchUserProfile, updateUserProfile } from '../services/profileApi';
import type { ProfileApiResponse } from '../types';

vi.mock('@core/http', () => ({
  get: vi.fn(),
  put: vi.fn(),
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
    vi.mocked(put).mockReset();
  });

  it('calls GET /api/me/profile and maps response to UserProfile', async () => {
    vi.mocked(get).mockResolvedValue(mockApiResponse);

    const result = await fetchUserProfile();

    expect(get).toHaveBeenCalledWith('/api/me/profile');
    expect(result).toEqual({
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: mockApiResponse.createdAt,
    });
  });

  it('propagates HTTP errors', async () => {
    vi.mocked(get).mockRejectedValue(new Error('Unauthorized'));

    await expect(fetchUserProfile()).rejects.toThrow('Unauthorized');
  });

  it('trims firstName, lastName and builds displayName from name', async () => {
    vi.mocked(get).mockResolvedValue({
      ...mockApiResponse,
      firstName: '  Blanca ',
      lastName: ' Barrera ',
      name: '  Blanca Barrera  ',
    });

    const result = await fetchUserProfile();

    expect(result.firstName).toBe('Blanca');
    expect(result.lastName).toBe('Barrera');
    expect(result.displayName).toBe('Blanca Barrera');
  });

  it('PUT /api/me/profile with firstName, lastName, email and maps response', async () => {
    vi.mocked(put).mockResolvedValue({
      ...mockApiResponse,
      firstName: 'Blanca ',
      lastName: 'Barrera',
      name: 'Blanca Barrera',
      email: 'blanca.barrera@aranea.co',
    });

    const result = await updateUserProfile({
      firstName: 'Blanca ',
      lastName: 'Barrera',
      email: 'blanca.barrera@aranea.co',
    });

    expect(put).toHaveBeenCalledWith('/api/me/profile', {
      firstName: 'Blanca ',
      lastName: 'Barrera',
      email: 'blanca.barrera@aranea.co',
    });
    expect(result.firstName).toBe('Blanca');
    expect(result.lastName).toBe('Barrera');
    expect(result.email).toBe('blanca.barrera@aranea.co');
  });
});
