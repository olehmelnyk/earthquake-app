import type { Metadata } from 'next'
import './global.css'; 
import '@earthquake-nx/ui'; 
import { ApolloWrapper } from '../lib/apollo-provider';
import { ThemeProvider } from '../components/theme-provider';
import { Toaster } from "@earthquake-nx/ui";

export const metadata: Metadata = {
  title: 'Earthquake App',
  description: 'Earthquake App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="m-0 p-0 w-full min-h-screen">
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <ApolloWrapper>
            {children}
            <Toaster />
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
