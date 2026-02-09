/**
 * App-wide constants (not feature-specific).
 */

export const APP_NAME = 'Gresst WebApp';

/** Single menu option (from Opciones Gresst.xlsx: IdOpcionSuperior + descripcion + url). */
export interface MenuOption {
  idOpcionSuperior: number;
  descripcion: string;
  url: string;
}

/** Group of menu options (subdivision by IdOpcionSuperior). Only items are links; group is visual only. */
export interface MenuOptionGroup {
  idOpcionSuperior: number;
  items: MenuOption[];
}

/**
 * Parses VITE_MENU_OPTIONS (JSON array of { idOpcionSuperior, descripcion, url }).
 * Returns groups sorted by idOpcionSuperior; each group contains items with that id.
 * Export from Excel: columns IdOpcionSuperior, Descripcion, Url.
 */
export function getMenuOptionGroups(): MenuOptionGroup[] {
  const raw = import.meta.env['VITE_MENU_OPTIONS'];
  if (typeof raw !== 'string' || raw.trim() === '') return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const options = parsed.filter(
      (item): item is MenuOption =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as MenuOption).idOpcionSuperior === 'number' &&
        typeof (item as MenuOption).descripcion === 'string' &&
        typeof (item as MenuOption).url === 'string'
    );
    const byGroup = new Map<number, MenuOption[]>();
    for (const opt of options) {
      const list = byGroup.get(opt.idOpcionSuperior) ?? [];
      list.push(opt);
      byGroup.set(opt.idOpcionSuperior, list);
    }
    // Order as in reference: Home (0), Procesos (3), Administración (1), Consultas (2), Configuración (4)
    const GROUP_DISPLAY_ORDER = [0, 3, 1, 2, 4];
    const orderIndex = (id: number) => {
      const i = GROUP_DISPLAY_ORDER.indexOf(id);
      return i >= 0 ? i : GROUP_DISPLAY_ORDER.length;
    };
    const sorted = Array.from(byGroup.entries()).sort(([a], [b]) => orderIndex(a) - orderIndex(b));
    return sorted.map(([idOpcionSuperior, items]) => ({ idOpcionSuperior, items }));
  } catch {
    return [];
  }
}

/**
 * Default menu structure from Opciones Gresst table: 24 options grouped by IdOpcionSuperior
 * (1 Administración, 2 Consulta, 3 Proceso, 4 Configuración). Home added for the app.
 * Order and items roughly follow the classic Gresst sidebar:
 * - Procesos
 * - Administración
 * - Consultas
 * - Configuración
 */
export function getDefaultMenuOptionGroups(): MenuOptionGroup[] {
  return [
    {
      idOpcionSuperior: 0,
      items: [{ idOpcionSuperior: 0, descripcion: 'Home', url: '/' }],
    },
    {
      // Procesos
      idOpcionSuperior: 3,
      items: [
        // The legacy app shows: Solicitudes, Recolección, Recepción, Tratamiento, Disposición, Transferencia.
        // We do not have a dedicated /solicitudes proceso route, so we start with Recolección/Recepción/Tratamiento.
        { idOpcionSuperior: 3, descripcion: 'Recolección', url: '/recoleccion' },
        { idOpcionSuperior: 3, descripcion: 'Recepción', url: '/recepcion' },
        { idOpcionSuperior: 3, descripcion: 'Tratamiento', url: '/tratamiento' },
        { idOpcionSuperior: 3, descripcion: 'Disposición', url: '/disposicion' },
        { idOpcionSuperior: 3, descripcion: 'Transferencia', url: '/transferencia' },
        { idOpcionSuperior: 3, descripcion: 'Entrada', url: '/entrada' },
      ],
    },
    {
      // Administración
      idOpcionSuperior: 1,
      items: [
        { idOpcionSuperior: 1, descripcion: 'Inventarios', url: '/administracion-inventario' },
        { idOpcionSuperior: 1, descripcion: 'Solicitudes', url: '/administracion-solicitud' },
        { idOpcionSuperior: 1, descripcion: 'Certificados', url: '/administracion-certificado' },
        { idOpcionSuperior: 1, descripcion: 'Integraciones', url: '/administracion-integracion' },
        // Extra admin option not present in the classic menu; keep it at the end.
        { idOpcionSuperior: 1, descripcion: 'Cuenta', url: '/administracion-cuenta' },
      ],
    },
    {
      // Consultas
      idOpcionSuperior: 2,
      items: [
        { idOpcionSuperior: 2, descripcion: 'Certificados', url: '/consulta-certificado' },
        { idOpcionSuperior: 2, descripcion: 'Residuos', url: '/consulta-residuo' },
        { idOpcionSuperior: 2, descripcion: 'Documentos', url: '/consulta-documento' },
        { idOpcionSuperior: 2, descripcion: 'KPIs', url: '/consulta-kpi' },
        { idOpcionSuperior: 2, descripcion: 'Órdenes', url: '/consulta-orden' },
        { idOpcionSuperior: 2, descripcion: 'Reportes', url: '/consulta-reporte' },
        { idOpcionSuperior: 2, descripcion: 'Solicitudes', url: '/consulta-solicitud' },
        { idOpcionSuperior: 2, descripcion: 'Tableros', url: '/consulta-dashboard' },
      ],
    },
    {
      // Configuración
      idOpcionSuperior: 4,
      items: [
        { idOpcionSuperior: 4, descripcion: 'Localizaciones', url: '/configuracion-localizacion' },
        { idOpcionSuperior: 4, descripcion: 'Personas', url: '/configuracion-persona' },
        { idOpcionSuperior: 4, descripcion: 'Materiales', url: '/configuracion-material' },
        { idOpcionSuperior: 4, descripcion: 'Servicios', url: '/configuracion-servicio' },
        { idOpcionSuperior: 4, descripcion: 'Vehículos', url: '/configuracion-vehiculo' },
      ],
    },
  ];
}

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
