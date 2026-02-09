/**
 * Password complexity rules and strength meter for change-password feature.
 * No spaces, max 128 chars, not all repeated, uppercase, lowercase, number, special.
 */

export const MIN_LENGTH = 8;
export const MAX_LENGTH = 128;

const SPECIAL_CHARS = /[!@#$%^&*(),.?":{}|<>]/;

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'length',
    label: `Mínimo ${MIN_LENGTH} caracteres`,
    test: (p) => p.length >= MIN_LENGTH,
  },
  {
    id: 'maxLength',
    label: `Máximo ${MAX_LENGTH} caracteres`,
    test: (p) => p.length <= MAX_LENGTH,
  },
  {
    id: 'noSpaces',
    label: 'Sin espacios',
    test: (p) => !/\s/.test(p),
  },
  {
    id: 'notRepeated',
    label: 'No solo caracteres repetidos',
    test: (p) => p.length === 0 || !/^(.)\1+$/.test(p),
  },
  {
    id: 'uppercase',
    label: 'Al menos una mayúscula',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'lowercase',
    label: 'Al menos una minúscula',
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: 'number',
    label: 'Al menos un número',
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: 'special',
    label: 'Al menos un carácter especial (!@#$%^&*…)',
    test: (p) => SPECIAL_CHARS.test(p),
  },
];

export interface RequirementResult {
  id: string;
  label: string;
  met: boolean;
}

export function getRequirementResults(password: string): RequirementResult[] {
  return PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    met: rule.test(password),
  }));
}

export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'empty';

/**
 * Strength from number of rules met and length. Empty = no input.
 * Weak (red): 0-3 rules or length < MIN. Medium (yellow): 4-5. Strong (green): 6+.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'empty';
  const results = getRequirementResults(password);
  const met = results.filter((r) => r.met).length;
  if (password.length < MIN_LENGTH || met <= 3) return 'weak';
  if (met <= 5) return 'medium';
  return 'strong';
}

/** All rules must pass for submit validation. */
export function validateNewPasswordRules(password: string): { valid: boolean; firstError?: string } {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) {
      return { valid: false, firstError: rule.label };
    }
  }
  return { valid: true };
}
