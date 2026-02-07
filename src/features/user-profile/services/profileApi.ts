/**
 * User profile API service. Consumes API via core HTTP client.
 * Endpoint: GET /api/me/profile
 */

import { get } from '@core/http';
import type { ProfileApiResponse, UserProfile } from '../types';

const PROFILE_ENDPOINT = '/api/me/profile';

function mapApiResponseToProfile(res: ProfileApiResponse): UserProfile {
  return {
    id: res.id,
    email: res.email,
    displayName: res.name?.trim() ?? '',
    createdAt: res.createdAt,
  };
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const data = await get<ProfileApiResponse>(PROFILE_ENDPOINT);
  return mapApiResponseToProfile(data);
}
