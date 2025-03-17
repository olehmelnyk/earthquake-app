'use client';

import { useState } from 'react';
import { MainLayout } from '../components/layout/main-layout';
import { EarthquakeFilters } from '@earthquake-nx/ui';
import { EarthquakeTable } from '../components/earthquake-table';
import type { EarthquakeFilterInput } from '../lib/graphql/queries';

export default function EarthquakePage() {
  const [filter, setFilter] = useState<EarthquakeFilterInput>({});

  const handleFilterChange = (newFilters: any) => {
    // Convert from UI package filter format to app-specific format
    const appFilter: EarthquakeFilterInput = {};
    
    if (newFilters.location) {
      appFilter.location = newFilters.location;
    }
    
    if (newFilters.minMagnitude !== undefined || newFilters.maxMagnitude !== undefined) {
      appFilter.magnitude = {
        min: newFilters.minMagnitude ?? 0,
        max: newFilters.maxMagnitude ?? 10
      };
    }
    
    if (newFilters.startDate || newFilters.endDate) {
      appFilter.date = {};
      if (newFilters.startDate) appFilter.date.start = newFilters.startDate; // Use string directly
      if (newFilters.endDate) appFilter.date.end = newFilters.endDate; // Use string directly
    }
    
    setFilter(appFilter);
  };

  // Convert app-specific filter to UI package format
  const uiFilters = {
    location: filter.location || '',
    minMagnitude: filter.magnitude?.min ?? 0,
    maxMagnitude: filter.magnitude?.max ?? 10,
    startDate: filter.date?.start || '',
    endDate: filter.date?.end || ''
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col space-y-1.5">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Earthquake Management</h1>
          <p className="text-muted-foreground">View and filter earthquake data from around the world.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-80 shrink-0">
            <EarthquakeFilters 
              initialFilters={uiFilters}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="flex-1">
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
      </div>
    </MainLayout>
  );
}
