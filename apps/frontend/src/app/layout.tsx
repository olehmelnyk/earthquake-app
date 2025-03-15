import './global.css';
import { ApolloWrapper } from '../lib/apollo-provider';
import { ThemeProvider } from '../components/theme-provider';

export const metadata = {
  title: 'Earthquake App',
  description: 'An application to monitor and manage earthquake information',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh' }}>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
