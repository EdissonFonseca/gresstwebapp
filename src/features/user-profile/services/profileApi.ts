/**
 * User profile API service. Consumes API via core HTTP client.
 * GET /api/me/profile, PUT /api/me/profile
 */

import { get, put } from '@core/http';
import type { ProfileApiResponse, UpdateProfilePayload, UserProfile } from '../types';

const PROFILE_ENDPOINT = '/api/me/profile';

function mapApiResponseToProfile(res: ProfileApiResponse): UserProfile {
  const firstName = res.firstName?.trim() ?? '';
  const lastName = res.lastName?.trim() ?? '';
  const name = (res.name?.trim() ?? [firstName, lastName].filter(Boolean).join(' ')) || '';
  return {
    id: res.id,
    firstName,
    lastName,
    email: res.email ?? '',
    displayName: name,
    createdAt: res.createdAt,
  };
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const data = await get<ProfileApiResponse>(PROFILE_ENDPOINT);
  return mapApiResponseToProfile(data);
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const data = await put<ProfileApiResponse>(PROFILE_ENDPOINT, payload);
  return mapApiResponseToProfile(data);
}
