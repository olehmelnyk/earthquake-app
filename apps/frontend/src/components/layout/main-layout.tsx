'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { ApolloWrapper } from '../../lib/apollo-provider';
import { ThemeProvider } from '../theme-provider';

export interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main layout component for the earthquake application
 * Provides structure with header, optional sidebar, and main content area
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="earthquake-theme">
      <ApolloWrapper>
        <div className="flex h-screen flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar className="hidden w-64 md:block" />
            <main className="flex-1 overflow-y-auto p-6 bg-background">
              <div className="mx-auto w-full max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ApolloWrapper>
    </ThemeProvider>
  );
};
