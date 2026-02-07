/**
 * HTTP client config. All values from env; no hardcoded backend URLs.
 * Ensures browser-side, decoupled from any legacy backend.
 */

/** Base URL for API. Set VITE_API_BASE_URL in .env (e.g. https://api.example.com). */
export const apiBaseUrl = ((): string => {
  const url = import.meta.env['VITE_API_BASE_URL'];
  if (typeof url === 'string' && url.length > 0) return url.replace(/\/$/, '');
  return '';
})();

/** Send cookies with requests when true (e.g. when backend sets httpOnly cookie). */
export const useCredentials = import.meta.env['VITE_API_USE_CREDENTIALS'] === 'true';

export function buildApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base = apiBaseUrl;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}
