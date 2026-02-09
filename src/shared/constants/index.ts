/**
 * App-wide constants (not feature-specific).
 */

export const APP_NAME = 'Gresst WebApp';

/** External menu item: label shown in sidebar and full URL (e.g. Gestor QA/prod). */
export interface MenuExternalLink {
  label: string;
  url: string;
}

/**
 * Parses VITE_MENU_EXTERNAL_LINKS (JSON array of { label, url }) for sidebar.
 * QA example: [{"label":"Solicitudes","url":"https://qa.gestor.gresst.com/Solicitudes.aspx"}]
 * Prod example: [{"label":"Gestor","url":"https://gestor.gresst.com/Home.aspx"}]
 */
export function getMenuExternalLinks(): MenuExternalLink[] {
  const raw = import.meta.env['VITE_MENU_EXTERNAL_LINKS'];
  if (typeof raw !== 'string' || raw.trim() === '') return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is MenuExternalLink =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as MenuExternalLink).label === 'string' &&
        typeof (item as MenuExternalLink).url === 'string'
    );
  } catch {
    return [];
  }
}
