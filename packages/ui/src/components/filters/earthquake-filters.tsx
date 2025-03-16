"use client";

import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RangeSlider } from '../ui/slider';
import { FilterValues } from '../../types';

export interface EarthquakeFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
  className?: string;
}

/**
 * Filter component for earthquake data
 * Provides controls for filtering by location, magnitude range, and date range
 */
export function EarthquakeFilters({
  onFilterChange,
  initialFilters = {},
  className,
}: EarthquakeFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [magnitudeRange, setMagnitudeRange] = useState<[number, number]>([
    initialFilters.minMagnitude ?? 0,
    initialFilters.maxMagnitude ?? 10
  ]);

  // Sync with external initialFilters changes
  useEffect(() => {
    setMagnitudeRange([
      initialFilters.minMagnitude ?? 0,
      initialFilters.maxMagnitude ?? 10
    ]);
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number = value;
    if (type === 'number' && value !== '') {
      parsedValue = parseFloat(value);
    }

    setFilters((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleMagnitudeRangeChange = (values: [number, number]) => {
    setMagnitudeRange(values);
    setFilters((prev) => ({
      ...prev,
      minMagnitude: values[0],
      maxMagnitude: values[1]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      location: '',
      minMagnitude: undefined,
      maxMagnitude: undefined,
      startDate: '',
      endDate: '',
    };
    setFilters(resetFilters);
    setMagnitudeRange([0, 10]);
    onFilterChange(resetFilters);
  };

  return (
    <div className={cn("space-y-5", className)}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., 37.7749,-122.4194"
            value={filters.location || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Magnitude Range</Label>
            <span className="text-sm font-medium">
              {magnitudeRange[0].toFixed(1)} - {magnitudeRange[1].toFixed(1)}
            </span>
          </div>
          <div className="py-2">
            <RangeSlider
              min={0}
              max={10}
              step={0.1}
              values={magnitudeRange}
              onChange={handleMagnitudeRangeChange}
              defaultValues={[0, 10]}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={filters.startDate || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={filters.endDate || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button type="submit">Apply Filters</Button>
        </div>
      </form>
    </div>
  );
}
