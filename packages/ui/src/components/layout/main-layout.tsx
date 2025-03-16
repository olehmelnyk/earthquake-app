import * as React from 'react';
import { cn } from '../../lib/utils';

export interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main layout component for the earthquake application
 * Provides structure with header and main content area
 */
export function MainLayout({
  children,
  className,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className={cn("flex-1 p-4 md:p-6", className)}>
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
