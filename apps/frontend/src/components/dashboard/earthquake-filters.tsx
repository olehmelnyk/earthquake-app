"use client";

import { useState, useEffect } from 'react';
import { Button } from '@earthquake-nx/ui';
import { Input } from '@earthquake-nx/ui';
import { Label } from '@earthquake-nx/ui';

export interface FilterValues {
  location?: string;
  minMagnitude?: number;
  maxMagnitude?: number;
  startDate?: string;
  endDate?: string;
}

export interface EarthquakeFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
  className?: string;
}

export function EarthquakeFilters({
  onFilterChange,
  initialFilters = {},
  className,
}: EarthquakeFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  // Sync with external initialFilters changes
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number = value;
    if (type === 'number' && value !== '') {
      parsedValue = parseFloat(value);
    }

    const newFilters = {
      ...filters,
      [name]: parsedValue,
    };

    setFilters(newFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      location: '',
      minMagnitude: 0,
      maxMagnitude: 10,
      startDate: '',
      endDate: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="Filter by location"
            value={filters.location || ''}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minMagnitude">Min Magnitude</Label>
            <Input
              id="minMagnitude"
              name="minMagnitude"
              type="number"
              min={0}
              max={10}
              step={0.1}
              placeholder="Min"
              value={filters.minMagnitude ?? ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="maxMagnitude">Max Magnitude</Label>
            <Input
              id="maxMagnitude"
              name="maxMagnitude"
              type="number"
              min={0}
              max={10}
              step={0.1}
              placeholder="Max"
              value={filters.maxMagnitude ?? ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={filters.startDate || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={filters.endDate || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit">Apply Filters</Button>
        </div>
      </div>
    </form>
  );
}
