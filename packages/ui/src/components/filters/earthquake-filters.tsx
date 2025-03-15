import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
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
    onFilterChange(resetFilters);
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Filter Earthquakes</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="minMagnitude">Minimum Magnitude</Label>
            <Input 
              id="minMagnitude"
              name="minMagnitude"
              type="number"
              min={0}
              max={10}
              step={0.1}
              placeholder="0.0"
              value={filters.minMagnitude || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxMagnitude">Maximum Magnitude</Label>
            <Input 
              id="maxMagnitude"
              name="maxMagnitude"
              type="number"
              min={0}
              max={10}
              step={0.1}
              placeholder="10.0"
              value={filters.maxMagnitude || ''}
              onChange={handleInputChange}
            />
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
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
}
