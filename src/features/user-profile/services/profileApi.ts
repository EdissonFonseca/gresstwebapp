/**
 * User profile API service. Consumes API via core HTTP client.
 */

import { get } from '@core/http';
import type { UserProfile } from '../types';

const PROFILE_ENDPOINT = '/api/profile';

export async function fetchUserProfile(): Promise<UserProfile> {
  return get<UserProfile>(PROFILE_ENDPOINT);
}
