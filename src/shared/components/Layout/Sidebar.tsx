import { NavLink } from 'react-router-dom';
import { getMenuExternalLinks } from '@shared/constants';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

/** Paths must match ROUTES in @core/routing to avoid loading that module at top level (test env). */
const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/profile', label: 'Profile', icon: ProfileIcon },
] as const;

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
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

/**
 * Collapsible sidebar. Collapsed: narrow strip with icons; expanded: full width with labels.
 */
export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}
      aria-label="Main navigation"
      aria-expanded={isOpen}
    >
      <button
        type="button"
        className="sidebar__toggle"
        onClick={onToggle}
        aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}
        title={isOpen ? 'Collapse menu' : 'Expand menu'}
      >
        <ChevronIcon isOpen={isOpen} />
      </button>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            end={to === '/'}
          >
            <span className="sidebar__icon" aria-hidden>
              <Icon />
            </span>
            {isOpen && <span className="sidebar__label">{label}</span>}
          </NavLink>
        ))}
        {getMenuExternalLinks().map(({ label, url }) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
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
