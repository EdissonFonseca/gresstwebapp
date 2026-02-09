import type { ReactNode } from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './MainLayout.css';

interface MainLayoutProps {
  children?: ReactNode;
}

/**
 * Main app layout with collapsible sidebar and header. Use Outlet for nested route content.
 */
export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="main-layout">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((o) => !o)} />
      <div className="main-layout__body">
        <header className="main-layout__header" aria-label="App header">
          <div className="main-layout__brand">Gresst</div>
        </header>
        <main className="main-layout__main" id="main-content">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
