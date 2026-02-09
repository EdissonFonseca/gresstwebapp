/**
 * Sidebar menu icons via react-icons (Font Awesome 5).
 * Maps menu option URL to an icon; unknown options get a default.
 */
import type { ComponentType } from 'react';
import {
  FaHome,
  FaCertificate,
  FaUserCog,
  FaPlug,
  FaBoxes,
  FaClipboardList,
  FaFileAlt,
  FaChartLine,
  FaListOl,
  FaFileExport,
  FaTrashAlt,
  FaThLarge,
  FaDumpster,
  FaWarehouse,
  FaTruck,
  FaSignInAlt,
  FaExchangeAlt,
  FaIndustry,
  FaMapMarkerAlt,
  FaUsers,
  FaBox,
  FaCog,
  FaFile,
} from 'react-icons/fa';
import type { MenuOption } from '@shared/constants';

/** Icon component type (react-icons render as function components). */
type IconComponent = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

/** Default icon for menu options not in the map (e.g. from VITE_MENU_OPTIONS). */
const DEFAULT_ICON: IconComponent = FaFile;

/** URL -> Font Awesome icon for default Gresst menu (internal routes). */
const ICON_BY_URL: Record<string, IconComponent> = {
  '/': FaHome,
  '/administracion-certificado': FaCertificate,
  '/administracion-cuenta': FaUserCog,
  '/administracion-integracion': FaPlug,
  '/administracion-inventario': FaBoxes,
  '/administracion-solicitud': FaClipboardList,
  '/consulta-certificado': FaCertificate,
  '/consulta-documento': FaFileAlt,
  '/consulta-kpi': FaChartLine,
  '/consulta-orden': FaListOl,
  '/consulta-reporte': FaFileExport,
  '/consulta-residuo': FaTrashAlt,
  '/consulta-solicitud': FaClipboardList,
  '/consulta-dashboard': FaThLarge,
  '/disposicion': FaDumpster,
  '/recepcion': FaWarehouse,
  '/recoleccion': FaTruck,
  '/entrada': FaSignInAlt,
  '/transferencia': FaExchangeAlt,
  '/tratamiento': FaIndustry,
  '/configuracion-localizacion': FaMapMarkerAlt,
  '/configuracion-persona': FaUsers,
  '/configuracion-material': FaBox,
  '/configuracion-servicio': FaCog,
  '/configuracion-vehiculo': FaTruck,
};

/** descripcion (label) -> icon for external or unknown URLs (e.g. from VITE_MENU_OPTIONS). */
const ICON_BY_DESCRIPCION: Record<string, IconComponent> = {
  Home: FaHome,
  Recolección: FaTruck,
  Recepción: FaWarehouse,
  Tratamiento: FaIndustry,
  Disposición: FaDumpster,
  Transferencia: FaExchangeAlt,
  Entrada: FaSignInAlt,
  Inventarios: FaBoxes,
  Solicitudes: FaClipboardList,
  Certificados: FaCertificate,
  Integraciones: FaPlug,
  Cuenta: FaUserCog,
  Documentos: FaFileAlt,
  KPIs: FaChartLine,
  Órdenes: FaListOl,
  Reportes: FaFileExport,
  Residuos: FaTrashAlt,
  Tableros: FaThLarge,
  Localizaciones: FaMapMarkerAlt,
  Personas: FaUsers,
  Materiales: FaBox,
  Servicios: FaCog,
  Vehículos: FaTruck,
};

/**
 * Returns the icon component for a menu option.
 * Resolves by URL first (internal routes), then by descripcion (external/legacy URLs from VITE_MENU_OPTIONS).
 */
export function getMenuIconComponent(item: MenuOption): IconComponent {
  return ICON_BY_URL[item.url] ?? ICON_BY_DESCRIPCION[item.descripcion] ?? DEFAULT_ICON;
}
