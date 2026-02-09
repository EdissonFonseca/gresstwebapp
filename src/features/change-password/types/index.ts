/**
 * Change password feature types.
 */

/** Request body for POST /api/v1/authentication/change-password */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** 200 OK response */
export interface ChangePasswordSuccessResponse {
  message: string;
}

/** Single requirement in 400 policy validation (same shape in register, reset-password, change-password, etc.) */
export interface PasswordValidationRequirement {
  id: string;
  message: string;
  met: boolean;
}

/** validation object in 400 when error is "Password does not meet security requirements" */
export interface PasswordValidationBody {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  requirements: PasswordValidationRequirement[];
}

/** 400 Bad Request response body (plain error or policy validation) */
export interface ChangePasswordErrorBody {
  error: string;
  /** Present when error is "Password does not meet security requirements" */
  validation?: PasswordValidationBody;
}

/** Client-side validation result */
export interface ChangePasswordValidation {
  valid: boolean;
  error?: string;
}
