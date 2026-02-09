/**
 * Change password API. POST /api/v1/authentication/change-password.
 * 200: { message }; 400: { error }; 401: no body (unauthorized).
 */

import { post } from '@core/http';
import type { ChangePasswordRequest, ChangePasswordSuccessResponse } from '../types';

const CHANGE_PASSWORD_ENDPOINT = '/api/v1/authentication/change-password';

export async function changePassword(
  payload: ChangePasswordRequest
): Promise<ChangePasswordSuccessResponse> {
  return post<ChangePasswordSuccessResponse>(CHANGE_PASSWORD_ENDPOINT, payload);
}
