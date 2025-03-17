'use client';

import { ApolloWrapper } from './apollo-provider';
import { ThemeProvider } from './theme-provider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <ApolloWrapper>
        {children}
      </ApolloWrapper>
    </ThemeProvider>
  );
}