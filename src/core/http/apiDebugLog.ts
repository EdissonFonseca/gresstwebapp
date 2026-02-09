/**
 * Debug log for API requests (Me/Profile and others). Enabled via config.json debugApiLog or .env VITE_DEBUG_API_LOG.
 * Collects request/response info; user can download as a file to verify URL, credentials, CORS, etc.
 */

import { getApiBaseUrl, getUseCredentials, isDebugApiLog } from '@core/config/runtimeConfig';

interface LogEntry {
  ts: string;
  type: 'request' | 'response' | 'error' | 'info';
  message: string;
  detail?: string;
}

const entries: LogEntry[] = [];

function line(entry: LogEntry): string {
  const detail = entry.detail ? `\n  ${entry.detail.replace(/\n/g, '\n  ')}` : '';
  return `[${entry.ts}] ${entry.type.toUpperCase()}: ${entry.message}${detail}`;
}

export function apiLogRequest(params: {
  url: string;
  method: string;
  credentials: RequestCredentials;
  hasAuthHeader: boolean;
}): void {
  if (!isDebugApiLog()) return;
  entries.push({
    ts: new Date().toISOString(),
    type: 'request',
    message: `${params.method} ${params.url}`,
    detail: [
      `credentials: ${params.credentials}`,
      `Authorization header: ${params.hasAuthHeader ? 'yes' : 'no'}`,
      `(Cookies: if httpOnly, browser sends them automatically when credentials=include; check backend CORS Allow-Credentials and cookie domain.)`,
    ].join('\n'),
  });
}

export function apiLogResponse(params: {
  url: string;
  status: number;
  statusText: string;
  ok: boolean;
  errorBody?: unknown;
}): void {
  if (!isDebugApiLog()) return;
  const bodyStr =
    params.errorBody !== undefined
      ? typeof params.errorBody === 'object'
        ? JSON.stringify(params.errorBody, null, 2)
        : String(params.errorBody)
      : '';
  entries.push({
    ts: new Date().toISOString(),
    type: params.ok ? 'response' : 'error',
    message: `${params.status} ${params.statusText} ${params.url}`,
    detail: bodyStr
      ? `Response body:\n${bodyStr}`
      : 'Verify in backend/KPIS: CORS Allow-Origin (exact origin, not *), Allow-Credentials: true; cookie SameSite/Secure/Domain for cross-origin.',
  });
}

export function apiLogInfo(message: string, detail?: string): void {
  if (!isDebugApiLog()) return;
  entries.push({
    ts: new Date().toISOString(),
    type: 'info',
    message,
    detail,
  });
}

export function getApiLogAsString(): string {
  const header = [
    'API debug log',
    `Generated: ${new Date().toISOString()}`,
    `apiBaseUrl: ${getApiBaseUrl() || '(empty)'}`,
    `useCredentials: ${getUseCredentials()}`,
    '---',
  ].join('\n');
  return [header, ...entries.map(line)].join('\n');
}

export function downloadApiLogAsFile(): void {
  const content = getApiLogAsString();
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `api-debug-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
  a.click();
  URL.revokeObjectURL(url);
}

export function isApiDebugLogEnabled(): boolean {
  return isDebugApiLog();
}
