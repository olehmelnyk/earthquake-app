'use client';

import { EarthquakeDashboard } from '../components/dashboard/earthquake-dashboard';
import { Header } from '../components/layout/header';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Header />
      <main style={{ flex: '1', padding: '1.5rem' }}>
        <EarthquakeDashboard />
      </main>
    </div>
  );
}
