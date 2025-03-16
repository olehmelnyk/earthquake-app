'use client';

import { MainLayout } from '../components/layout/main-layout';
import { EarthquakeDashboard } from '../components/dashboard/earthquake-dashboard';

export default function HomePage() {
  return (
    <MainLayout>
      <EarthquakeDashboard />
    </MainLayout>
  );
}
