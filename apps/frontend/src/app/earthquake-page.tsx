'use client';

import { useState } from 'react';
import { MainLayout } from '@earthquake-nx/ui';
import { EarthquakeTable } from '../components/earthquake-table';
import { EarthquakeFilter } from '../components/earthquake-filter';
import type { EarthquakeFilterInput } from '../lib/hooks/use-earthquakes';

export default function EarthquakePage() {
  const [filter, setFilter] = useState<EarthquakeFilterInput>({});

  return (
    <MainLayout className="bg-slate-500">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col space-y-1.5">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Earthquake Management</h1>
          <p className="text-muted-foreground">View and filter earthquake data from around the world.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-card shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Filters</h2>
            <EarthquakeFilter
              onFilterChange={setFilter}
              initialFilter={filter}
            />
          </div>

          <div className="rounded-lg border bg-card shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-card-foreground">Earthquake Data</h2>
              <div className="text-sm text-muted-foreground">
                Showing the most recent earthquakes
              </div>
            </div>
            <EarthquakeTable filter={filter} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
