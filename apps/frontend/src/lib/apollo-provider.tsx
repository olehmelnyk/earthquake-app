'use client';

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { useMemo, type ReactNode } from 'react';

interface ApolloWrapperProps {
  children: ReactNode;
}

export function ApolloWrapper({ children }: ApolloWrapperProps): JSX.Element {
  const client = useMemo(() => {
    return new ApolloClient({
      link: new HttpLink({
        uri: '/api/graphql',
        // Include credentials for cookie-based auth if needed
        credentials: 'same-origin',
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only', // Don't cache for this demo app
          errorPolicy: 'all',
        },
        watchQuery: {
          fetchPolicy: 'network-only', // Don't cache for this demo app
          errorPolicy: 'all',
        },
      },
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
