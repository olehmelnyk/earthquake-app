'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { EarthquakeFilterInput } from '../lib/hooks/use-earthquakes';

interface EarthquakeFilterProps {
  onFilterChange: (filter: EarthquakeFilterInput) => void;
  initialFilter?: EarthquakeFilterInput;
}

export function EarthquakeFilter({ onFilterChange, initialFilter }: EarthquakeFilterProps) {
  const [filter, setFilter] = useState<EarthquakeFilterInput>(initialFilter || {});
  const [location, setLocation] = useState<string>('');
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
    <Card>
      <CardHeader>
        <CardTitle>Filter Earthquakes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location filter */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              placeholder="Enter location..."
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Magnitude filters */}
          <div className="space-y-2">
            <Label>Magnitude Range</Label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={minMagnitude === undefined ? '' : minMagnitude}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinMagnitude(e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="Min"
                step="0.1"
                min="0"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={maxMagnitude === undefined ? '' : maxMagnitude}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxMagnitude(e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="Max"
                step="0.1"
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Date filters */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={startDate || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value || undefined)}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                value={endDate || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value || undefined)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            onClick={resetFilters}
            variant="outline"
          >
            Reset
          </Button>
          <Button
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
