import type { ReactNode } from 'react';
import { useState, useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { UserMenu } from './UserMenu';
import clientLogoUrl from '../../assets/images/client-logo-placeholder.svg';
import './MainLayout.css';

interface MainLayoutProps {
  children?: ReactNode;
}

const HOVER_COLLAPSE_DELAY_MS = 300;

/**
 * Main app layout with sidebar that deploys from the left on click or hover.
 */
export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current !== null) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearHoverTimeout();
    setIsSidebarOpen(true);
  }, [clearHoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      setIsSidebarOpen(false);
      hoverTimeoutRef.current = null;
    }, HOVER_COLLAPSE_DELAY_MS);
  }, [clearHoverTimeout]);

  return (
    <div className="main-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((o) => !o)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <div className="main-layout__body">
        <header className="main-layout__header" aria-label="App header">
          <div className="main-layout__branding">
            <img
              src={clientLogoUrl}
              alt="Logo del cliente"
              className="main-layout__client-logo"
              height={32}
              fetchPriority="high"
            />
          </div>
          <div className="main-layout__header-actions">
            <UserMenu />
          </div>
        </header>
        <main className="main-layout__main" id="main-content">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
