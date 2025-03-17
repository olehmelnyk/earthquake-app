import type { Metadata } from 'next'
import './global.css';
import { Toaster } from "@earthquake-app/ui";
import { ClientProviders } from '../components/client-providers';

export const metadata: Metadata = {
  title: 'Earthquake App',
  description: 'Take home assignment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head />
      <body className="h-full bg-background text-foreground antialiased">
        <ClientProviders>
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  )
}
