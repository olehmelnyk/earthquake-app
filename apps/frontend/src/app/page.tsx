'use client';

import { EarthquakeDashboard } from '../components/dashboard/earthquake-dashboard';
import { Header } from '../components/layout/header';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 p-6">
        <EarthquakeDashboard />
      </main>
    </div>
  );
}
