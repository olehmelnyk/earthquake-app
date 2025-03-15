import * as React from 'react';
import { cn } from '../../lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';

export interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
}

/**
 * Main layout component for the earthquake application
 * Provides structure with header, optional sidebar, and main content area
 */
export function MainLayout({
  children,
  className,
  showSidebar = true,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background antialiased">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar className="hidden md:block" />}
        <main 
          className={cn(
            "flex-1 overflow-y-auto bg-background p-4 md:p-6",
            className
          )}
        >
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
