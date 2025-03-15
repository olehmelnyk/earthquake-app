'use client';

import { useState } from 'react';
import { EarthquakeTable } from '../components/earthquake-table';
import { EarthquakeFilter } from '../components/earthquake-filter';
import type { EarthquakeFilterInput } from '../lib/hooks/use-earthquakes';

export default function Page() {
  const [filter, setFilter] = useState<EarthquakeFilterInput>({});

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Earthquake Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <EarthquakeFilter
          onFilterChange={setFilter}
          initialFilter={filter}
        />

        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Earthquake Data</h2>
          <EarthquakeTable filter={filter} />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <p className="text-center text-gray-500 text-sm">
            Earthquake Management Application — {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
