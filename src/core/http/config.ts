/**
 * HTTP client config. Reads from runtime config (config.json) with build-time .env fallback.
 * In dist, override via config.json per environment (e.g. IIS) without rebuilding.
 */

import { getApiBaseUrl as getRuntimeApiBaseUrl, getUseCredentials as getRuntimeUseCredentials } from '@core/config/runtimeConfig';

export function buildApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base = getRuntimeApiBaseUrl();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}

/** Send cookies with requests when true. Resolved from config.json or .env. */
export function getUseCredentials(): boolean {
  return getRuntimeUseCredentials();
}
