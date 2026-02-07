import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

interface MainLayoutProps {
  children?: ReactNode;
}

/**
 * Main app layout. No legacy menu — simple wrapper with optional header and content area.
 * Use Outlet for nested route content.
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <header className="main-layout__header" aria-label="App header">
        <div className="main-layout__brand">Gresst</div>
      </header>
      <main className="main-layout__main" id="main-content">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
