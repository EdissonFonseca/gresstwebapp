/**
 * Runtime configuration loaded from /config.json (e.g. in dist for IIS).
 * Allows changing API URL, menuBaseUrl, etc. per environment without rebuilding.
 * Menu options (VITE_MENU_OPTIONS / menuExternalLinks) stay fixed from build-time .env only.
 */

export interface RuntimeConfigOverlay {
  apiBaseUrl?: string;
  useCredentials?: boolean;
  /** Base URL for external menu links (e.g. QA vs prod Gestor). Menu items come from .env only. */
  menuBaseUrl?: string;
  authCookieName?: string;
  debugApiLog?: boolean;
}

export type MenuOptionRaw = { idOpcionSuperior: number; descripcion: string; url: string };
export type MenuExternalLinkRaw = { label: string; url: string };

let overlay: RuntimeConfigOverlay | null = null;

function buildTimeApiBaseUrl(): string {
  const url = import.meta.env['VITE_API_BASE_URL'];
  if (typeof url === 'string' && url.length > 0) return url.replace(/\/$/, '');
  return '';
}

function buildTimeUseCredentials(): boolean {
  return import.meta.env['VITE_API_USE_CREDENTIALS'] === 'true';
}

function buildTimeMenuBaseUrl(): string {
  const v = import.meta.env['VITE_MENU_BASE_URL'];
  return typeof v === 'string' ? v.trim() : '';
}

function buildTimeMenuOptions(): MenuOptionRaw[] | undefined {
  const raw = import.meta.env['VITE_MENU_OPTIONS'];
  if (typeof raw !== 'string' || raw.trim() === '') return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as MenuOptionRaw[]) : undefined;
  } catch {
    return undefined;
  }
}

function buildTimeMenuExternalLinks(): MenuExternalLinkRaw[] | undefined {
  const raw = import.meta.env['VITE_MENU_EXTERNAL_LINKS'];
  if (typeof raw !== 'string' || raw.trim() === '') return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as MenuExternalLinkRaw[]) : undefined;
  } catch {
    return undefined;
  }
}

function buildTimeAuthCookieName(): string {
  const v = import.meta.env['VITE_AUTH_COOKIE_NAME'];
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : 'gresst_access_token';
}

function buildTimeDebugApiLog(): boolean {
  return import.meta.env['VITE_DEBUG_API_LOG'] === 'true';
}

/**
 * Load /config.json and merge with build-time defaults. Call once before app render (e.g. in main.tsx).
 * On 404 or parse error, overlay stays null and getters use only build-time values.
 */
export async function loadRuntimeConfig(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const base = window.location.origin;
    const res = await fetch(`${base}/config.json`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = (await res.json()) as unknown;
    if (data !== null && typeof data === 'object') {
      overlay = data as RuntimeConfigOverlay;
    }
  } catch {
    // 404, CORS, or invalid JSON: keep overlay null
  }
}

export function getApiBaseUrl(): string {
  const v = overlay?.apiBaseUrl;
  if (v !== undefined && v !== null) {
    const s = String(v).trim();
    return s.length > 0 ? s.replace(/\/+$/, '') : '';
  }
  return buildTimeApiBaseUrl();
}

export function getUseCredentials(): boolean {
  if (overlay?.useCredentials !== undefined) return Boolean(overlay.useCredentials);
  return buildTimeUseCredentials();
}

export function getMenuBaseUrl(): string {
  const v = overlay?.menuBaseUrl;
  if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim().replace(/\/+$/, '');
  return buildTimeMenuBaseUrl();
}

/** Menu options are fixed from .env (VITE_MENU_OPTIONS); not overridable via config.json. */
export function getMenuOptionsFromConfig(): MenuOptionRaw[] | undefined {
  return buildTimeMenuOptions();
}

/** External menu links are fixed from .env (VITE_MENU_EXTERNAL_LINKS); not overridable via config.json. */
export function getMenuExternalLinksFromConfig(): MenuExternalLinkRaw[] | undefined {
  return buildTimeMenuExternalLinks();
}

export function getAuthCookieName(): string {
  const v = overlay?.authCookieName;
  if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  return buildTimeAuthCookieName();
}

export function isDebugApiLog(): boolean {
  if (overlay?.debugApiLog !== undefined) return Boolean(overlay.debugApiLog);
  return buildTimeDebugApiLog();
}
