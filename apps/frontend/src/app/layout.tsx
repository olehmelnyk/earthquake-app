import './global.css';
import { ApolloWrapper } from '../lib/apollo-provider';

export const metadata = {
  title: 'Earthquake Management App',
  description: 'Monitor and manage earthquake data with GraphQL API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
