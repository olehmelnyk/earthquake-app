'use client';

import { useState } from 'react';
import { EarthquakeFilterInput } from '../lib/hooks/use-earthquakes';

interface EarthquakeFilterProps {
  onFilterChange: (filter: EarthquakeFilterInput) => void;
  initialFilter?: EarthquakeFilterInput;
}

export function EarthquakeFilter({ onFilterChange, initialFilter }: EarthquakeFilterProps) {
  const [filter, setFilter] = useState<EarthquakeFilterInput>(initialFilter || {});
  const [location, setLocation] = useState(filter.location || '');
  const [minMagnitude, setMinMagnitude] = useState<number | undefined>(filter.magnitude?.min);
  const [maxMagnitude, setMaxMagnitude] = useState<number | undefined>(filter.magnitude?.max);
  const [startDate, setStartDate] = useState<string | undefined>(
    filter.date?.start ? new Date(filter.date.start).toISOString().split('T')[0] : undefined
  );
  const [endDate, setEndDate] = useState<string | undefined>(
    filter.date?.end ? new Date(filter.date.end).toISOString().split('T')[0] : undefined
  );

  // Apply filters when user clicks the button
  const applyFilters = () => {
    const newFilter: EarthquakeFilterInput = {};
    
    // Only add non-empty filters
    if (location) {
      newFilter.location = location;
    }
    
    if (minMagnitude !== undefined || maxMagnitude !== undefined) {
      newFilter.magnitude = {};
      if (minMagnitude !== undefined) newFilter.magnitude.min = minMagnitude;
      if (maxMagnitude !== undefined) newFilter.magnitude.max = maxMagnitude;
    }
    
    if (startDate || endDate) {
      newFilter.date = {};
      if (startDate) newFilter.date.start = new Date(startDate);
      if (endDate) newFilter.date.end = new Date(endDate);
    }
    
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  // Reset all filters
  const resetFilters = () => {
    setLocation('');
    setMinMagnitude(undefined);
    setMaxMagnitude(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    
    const emptyFilter = {};
    setFilter(emptyFilter);
    onFilterChange(emptyFilter);
  };

  return (
    <div className="bg-white p-4 mb-6 rounded shadow">
      <h3 className="text-lg font-medium mb-4">Filter Earthquakes</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Location filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location || ''}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Filter by location"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Magnitude filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Magnitude Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={minMagnitude === undefined ? '' : minMagnitude}
              onChange={(e) => setMinMagnitude(e.target.value === '' ? undefined : Number(e.target.value))}
              placeholder="Min"
              step="0.1"
              min="0"
              className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={maxMagnitude === undefined ? '' : maxMagnitude}
              onChange={(e) => setMaxMagnitude(e.target.value === '' ? undefined : Number(e.target.value))}
              placeholder="Max"
              step="0.1"
              min="0"
              className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Date filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value || undefined)}
              className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value || undefined)}
              className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filter actions */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
