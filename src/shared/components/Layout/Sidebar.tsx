import { NavLink } from 'react-router-dom';
import { getMenuOptionGroups, getDefaultMenuOptionGroups, getMenuExternalLinks } from '@shared/constants';
import { getMenuIconComponent } from './menuIcons';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Sidebar: deploys from the left on click or hover. Options grouped by IdOpcionSuperior (subdivisions);
 * only items (descripcion) are links. Uses VITE_MENU_OPTIONS from Excel or default Gresst menu.
 */
export function Sidebar({ isOpen, onToggle, onMouseEnter, onMouseLeave }: SidebarProps) {
  const envGroups = getMenuOptionGroups();
  const groups = envGroups.length > 0 ? envGroups : getDefaultMenuOptionGroups();
  const externalLinks = getMenuExternalLinks();

  return (
    <aside
      className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}
      aria-label="Main navigation"
      aria-expanded={isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        type="button"
        className="sidebar__toggle"
        onClick={onToggle}
        aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}
        title={isOpen ? 'Collapse menu' : 'Expand menu'}
      >
        {isOpen ? <ChevronIcon isOpen /> : <MenuIcon />}
      </button>
      <nav className="sidebar__nav">
        {groups.map((group) => (
          <div key={group.idOpcionSuperior} className="sidebar__group" role="group">
            {group.items.map((item) => {
              const MenuItemIcon = getMenuIconComponent(item);
              return isExternalUrl(item.url) ? (
                <a
                  key={`${item.url}-${item.descripcion}`}
                  href={item.url}
                  className="sidebar__link sidebar__link--external"
                >
                  <span className="sidebar__icon" aria-hidden>
                    <MenuItemIcon />
                  </span>
                  {isOpen && <span className="sidebar__label">{item.descripcion}</span>}
                </a>
              ) : (
                <NavLink
                  key={`${item.url}-${item.descripcion}`}
                  to={item.url}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  end={item.url === '/'}
                >
                  <span className="sidebar__icon" aria-hidden>
                    <MenuItemIcon />
                  </span>
                  {isOpen && <span className="sidebar__label">{item.descripcion}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
        {externalLinks.map(({ label, url }) => (
          <a
            key={url}
            href={url}
            className="sidebar__link sidebar__link--external"
          >
            <span className="sidebar__icon" aria-hidden>
              <ExternalLinkIcon />
            </span>
            {isOpen && <span className="sidebar__label">{label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="sidebar__chevron"
      style={{ transform: isOpen ? 'rotate(180deg)' : undefined }}
      aria-hidden
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
