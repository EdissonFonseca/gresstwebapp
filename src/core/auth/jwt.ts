/**
 * JWT payload decoding (browser-side only). No signature verification — backend validates.
 * Use only to read claims (sub, email) for UI; never for security decisions.
 */

import type { AuthUser } from './types';

interface JwtPayload {
  sub?: string;
  email?: string;
  [key: string]: unknown;
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  try {
    return decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return '';
  }
}

/**
 * Decode JWT payload without verification. Returns null if invalid.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const json = base64UrlDecode(parts[1] ?? '');
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Extract AuthUser from JWT payload (sub → id, email).
 */
export function userFromJwtPayload(payload: JwtPayload | null): AuthUser | null {
  if (!payload || typeof payload.sub !== 'string') return null;
  return {
    id: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : undefined,
  };
}

/**
 * Parse token and return AuthUser for context. Safe for invalid/malformed tokens.
 */
export function parseUserFromToken(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);
  return userFromJwtPayload(payload);
}
