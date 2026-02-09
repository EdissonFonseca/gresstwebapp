import { useCallback, useState } from 'react';
import type { HttpError } from '@core/http';
import { changePassword as changePasswordApi } from '../services';
import { validateNewPasswordRules } from '../utils';
import type { ChangePasswordValidation, ChangePasswordErrorBody, PasswordValidationBody } from '../types';

function isChangePasswordErrorBody(body: unknown): body is ChangePasswordErrorBody {
  return (
    body !== null &&
    typeof body === 'object' &&
    'error' in body &&
    typeof (body as ChangePasswordErrorBody).error === 'string'
  );
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'body' in err) {
    const body = (err as HttpError).body;
    if (isChangePasswordErrorBody(body)) return body.error;
  }
  if (err instanceof Error) return err.message;
  return 'Failed to change password';
}

function getValidationFromError(err: unknown): PasswordValidationBody | null {
  if (err && typeof err === 'object' && 'body' in err) {
    const body = (err as HttpError).body;
    if (isChangePasswordErrorBody(body) && body.validation) return body.validation;
  }
  return null;
}

function validate(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): ChangePasswordValidation {
  if (!currentPassword.trim()) {
    return { valid: false, error: 'Current password is required.' };
  }
  if (!newPassword) {
    return { valid: false, error: 'New password is required.' };
  }
  const rulesCheck = validateNewPasswordRules(newPassword);
  if (!rulesCheck.valid) {
    return { valid: false, error: rulesCheck.firstError ?? 'New password does not meet requirements.' };
  }
  if (newPassword !== confirmPassword) {
    return { valid: false, error: 'New password and confirmation do not match.' };
  }
  if (currentPassword === newPassword) {
    return { valid: false, error: 'New password must be different from current password.' };
  }
  return { valid: true };
}

export interface UseChangePasswordResult {
  submit: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  /** Server validation when 400 "Password does not meet security requirements" */
  validation: PasswordValidationBody | null;
  success: boolean;
  clearState: () => void;
}

export function useChangePassword(): UseChangePasswordResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<PasswordValidationBody | null>(null);
  const [success, setSuccess] = useState(false);

  const clearState = useCallback(() => {
    setError(null);
    setValidation(null);
    setSuccess(false);
  }, []);

  const submit = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
      confirmPassword: string
    ): Promise<boolean> => {
      setError(null);
      setValidation(null);
      setSuccess(false);

      const clientValidation = validate(currentPassword, newPassword, confirmPassword);
      if (!clientValidation.valid) {
        setError(clientValidation.error ?? 'Invalid input');
        return false;
      }

      setIsLoading(true);
      try {
        await changePasswordApi({
          currentPassword,
          newPassword,
          confirmPassword,
        });
        setSuccess(true);
        setError(null);
        setValidation(null);
        return true;
      } catch (err) {
        setError(getErrorMessage(err));
        setValidation(getValidationFromError(err));
        setSuccess(false);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { submit, isLoading, error, validation, success, clearState };
}
