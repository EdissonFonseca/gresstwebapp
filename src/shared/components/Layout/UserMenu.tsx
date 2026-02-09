import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaKey,
  FaSignOutAlt,
  FaAddressCard,
  FaImage,
  FaIdCard,
  FaUsers,
  FaPalette,
  FaSlidersH,
} from 'react-icons/fa';
import { useAuthContext } from '@core/auth';
import './UserMenu.css';

/** Roles that see the "Administrar cuenta" section in the user menu (JWT role claim). */
const ACCOUNT_ADMIN_ROLES = ['AccountAdministrator', 'Admin', 'Administrator'];

/** Set to true to show "Administrar cuenta" for all users (e.g. while implementing). Set to false to gate by role. */
const SHOW_ACCOUNT_ADMIN_TO_ALL = true;

/** Standard user options (profile, password). */
const USER_MENU_OPTIONS = [
  { label: 'Mi perfil', path: '/profile', id: 'profile', Icon: FaUser },
  { label: 'Cambiar contraseña', path: '/cambiar-contrasena', id: 'password', Icon: FaKey },
] as const;

/** Account admin options (shown only when user role is in ACCOUNT_ADMIN_ROLES). */
const ACCOUNT_ADMIN_OPTIONS = [
  { label: 'Datos de la cuenta', path: '/cuenta/administrar/datos', id: 'admin-datos', Icon: FaAddressCard },
  { label: 'Imágenes', path: '/cuenta/administrar/imagenes', id: 'admin-imagenes', Icon: FaImage },
  { label: 'Licencias', path: '/cuenta/administrar/licencias', id: 'admin-licencias', Icon: FaIdCard },
  { label: 'Usuarios', path: '/cuenta/administrar/usuarios', id: 'admin-usuarios', Icon: FaUsers },
  { label: 'Personalizaciones', path: '/cuenta/administrar/personalizaciones', id: 'admin-personalizaciones', Icon: FaPalette },
  { label: 'Parámetros', path: '/cuenta/administrar/parametros', id: 'admin-parametros', Icon: FaSlidersH },
] as const;

/**
 * User menu in the top-right header: display name + dropdown with profile, account settings, change password, logout.
 */
export function UserMenu() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayName = user?.displayName?.trim() || user?.email || 'Usuario';
  const accountName = user?.accountName?.trim();
  const isAccountAdmin =
    SHOW_ACCOUNT_ADMIN_TO_ALL ||
    (user?.role != null && ACCOUNT_ADMIN_ROLES.includes(user.role));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="user-menu" ref={containerRef}>
      <button
        type="button"
        className="user-menu__trigger"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <span className="user-menu__icon" aria-hidden>
          <UserIcon />
        </span>
        <span className="user-menu__name">{displayName}</span>
        <span className="user-menu__chevron" aria-hidden>
          <ChevronIcon isOpen={isOpen} />
        </span>
      </button>
      {isOpen && (
        <div className="user-menu__dropdown" role="menu">
          {accountName && (
            <div className="user-menu__account" role="presentation" aria-label="Account name">
              <span className="user-menu__account-label">Cuenta</span>
              <span className="user-menu__account-name">{accountName}</span>
            </div>
          )}
          {accountName && <div className="user-menu__separator" role="separator" />}
          {USER_MENU_OPTIONS.map(({ label, path, id, Icon }) => (
            <Link
              key={id}
              to={path}
              className="user-menu__item"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <span className="user-menu__item-icon" aria-hidden>
                <Icon />
              </span>
              {label}
            </Link>
          ))}
          {isAccountAdmin && (
            <>
              <div className="user-menu__separator" role="separator" />
              <div className="user-menu__section-title" role="presentation">
                Administrar cuenta
              </div>
              {ACCOUNT_ADMIN_OPTIONS.map(({ label, path, id, Icon }) => (
                <Link
                  key={id}
                  to={path}
                  className="user-menu__item"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="user-menu__item-icon" aria-hidden>
                    <Icon />
                  </span>
                  {label}
                </Link>
              ))}
            </>
          )}
          <div className="user-menu__separator" role="separator" />
          <button
            type="button"
            className="user-menu__item user-menu__item--logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <span className="user-menu__item-icon" aria-hidden>
              <FaSignOutAlt />
            </span>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ transform: isOpen ? 'rotate(180deg)' : undefined }}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
