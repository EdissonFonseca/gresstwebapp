/**
 * Login API service. Same base URL as me/profile; endpoint /api/v1/authentication/login.
 * POST with Username/Password; returns accessToken and user info.
 */

import { post } from '@core/http';
import type { LoginRequest, LoginResponse } from '../types';

const LOGIN_ENDPOINT = '/api/v1/authentication/login';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>(LOGIN_ENDPOINT, credentials);
}
