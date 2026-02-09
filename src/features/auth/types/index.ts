/**
 * Auth feature types (login API).
 */

export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  success: boolean;
  error: string | null;
  accessToken: string;
  refreshToken: string;
  accessTokenType: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  subjectType: string;
  userId: string;
  accountId: string;
  accountPersonId: string;
  personId: string;
  name: string;
  email: string;
  roles: string[];
  cookieMessage?: string;
}
