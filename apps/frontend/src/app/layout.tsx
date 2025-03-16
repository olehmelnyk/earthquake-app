import './global.css';
import '@earthquake-nx/ui'; 
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
      <body suppressHydrationWarning className="m-0 p-0 w-full min-h-screen">
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
