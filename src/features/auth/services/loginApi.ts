/**
 * Login API service. Same base URL as me/profile.
 * POST with Username/Password; returns accessToken and user info.
 * Change LOGIN_ENDPOINT if your backend uses a different path.
 */

import { post } from '@core/http';
import type { LoginRequest, LoginResponse } from '../types';

const LOGIN_ENDPOINT = '/api/auth/login';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>(LOGIN_ENDPOINT, credentials);
}
