'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Label, RangeSlider } from '@earthquake-nx/ui';
import { EarthquakeFilterInput } from '../lib/hooks/use-earthquakes';

interface EarthquakeFilterProps {
  onFilterChange: (filter: EarthquakeFilterInput) => void;
  initialFilter?: EarthquakeFilterInput;
}

export function EarthquakeFilter({ onFilterChange, initialFilter }: EarthquakeFilterProps) {
  const [filter, setFilter] = useState<EarthquakeFilterInput>(initialFilter || {});
  const [location, setLocation] = useState<string>('');
  const [magnitudeRange, setMagnitudeRange] = useState<[number, number]>([
    filter.magnitude?.min ?? 0,
    filter.magnitude?.max ?? 10
  ]);
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

    if (magnitudeRange[0] > 0 || magnitudeRange[1] < 10) {
      newFilter.magnitude = {
        min: magnitudeRange[0],
        max: magnitudeRange[1]
      };
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
    setMagnitudeRange([0, 10]);
    setStartDate(undefined);
    setEndDate(undefined);

    const emptyFilter = {};
    setFilter(emptyFilter);
    onFilterChange(emptyFilter);
  };

  // Handle magnitude range change
  const handleMagnitudeRangeChange = (values: [number, number]) => {
    setMagnitudeRange(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Earthquakes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location filter */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              placeholder="e.g., 37.7749, 122.4194"
              className="w-full p-2 border rounded"
            />
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
          
          {/* Magnitude range slider */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex justify-between items-center">
              <Label>Magnitude Range</Label>
              <div className="text-sm font-medium">
                {magnitudeRange[0].toFixed(1)} - {magnitudeRange[1].toFixed(1)}
              </div>
            </div>
            
            <RangeSlider
              min={0}
              max={10}
              step={0.1}
              values={magnitudeRange}
              onChange={handleMagnitudeRangeChange}
              formatValue={(value) => value.toFixed(1)}
            />
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
