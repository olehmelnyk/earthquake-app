import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  EarthquakeFilters, 
  FilterValues
} from '@earthquake-nx/ui';

// Define Earthquake interface locally to match what the UI component expects
interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  date: string;
}

// Mock data for demonstration
const dummyEarthquakes: Earthquake[] = [
  { id: '1', magnitude: 5.4, location: '37.7749,-122.4194', date: '2023-09-15' },
  { id: '2', magnitude: 4.2, location: '34.0522,-118.2437', date: '2023-09-14' },
  { id: '3', magnitude: 3.8, location: '47.6062,-122.3321', date: '2023-09-13' },
  { id: '4', magnitude: 3.2, location: '45.5051,-122.6750', date: '2023-09-12' },
  { id: '5', magnitude: 4.7, location: '32.7157,-117.1611', date: '2023-09-11' },
];

export const EarthquakeDashboard = () => {
  const [filters, setFilters] = useState<FilterValues>({
    location: '',
    minMagnitude: 0,
    maxMagnitude: 10,
    startDate: '',
    endDate: '',
  });

  // Filter the earthquakes based on selected filters
  const filteredEarthquakes = dummyEarthquakes.filter((eq) => {
    // Location filter
    if (filters.location && !eq.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Magnitude filter
    if (filters.minMagnitude !== undefined && eq.magnitude < filters.minMagnitude) {
      return false;
    }
    if (filters.maxMagnitude !== undefined && eq.magnitude > filters.maxMagnitude) {
      return false;
    }

    // Date filter
    if (filters.startDate && new Date(eq.date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(eq.date) > new Date(filters.endDate)) {
      return false;
    }

    return true;
  });

  // Calculate statistics
  const avgMagnitude = filteredEarthquakes.length > 0 
    ? filteredEarthquakes.reduce((acc, eq) => acc + eq.magnitude, 0) / filteredEarthquakes.length 
    : 0;

  const latestEarthquake = filteredEarthquakes.length > 0 
    ? filteredEarthquakes.reduce((latest, eq) => 
        new Date(latest.date) > new Date(eq.date) ? latest : eq, filteredEarthquakes[0]).date
    : 'N/A';

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters section */}
        <Card className="md:col-span-1">
          <CardHeader className="px-6 py-4">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Refine earthquake data
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <EarthquakeFilters 
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </CardContent>
        </Card>

        {/* Dashboard content section */}
        <div className="md:col-span-3 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-semibold">Total Earthquakes</CardTitle>
                <CardDescription>Matching your filters</CardDescription>
              </CardHeader>
              <CardContent className="pt-1 text-center">
                <p className="text-3xl font-bold">{filteredEarthquakes.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-semibold">Average Magnitude</CardTitle>
                <CardDescription>Of filtered earthquakes</CardDescription>
              </CardHeader>
              <CardContent className="pt-1 text-center">
                <p className="text-3xl font-bold">{avgMagnitude.toFixed(1)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-semibold">Latest Earthquake</CardTitle>
                <CardDescription>Most recent event</CardDescription>
              </CardHeader>
              <CardContent className="pt-1 text-center">
                <p className="text-3xl font-bold">{latestEarthquake}</p>
              </CardContent>
            </Card>
          </div>
            
          {/* Earthquakes Table */}
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>Earthquake Data</CardTitle>
              <CardDescription>
                {filteredEarthquakes.length > 0 
                  ? `Showing ${filteredEarthquakes.length} earthquakes` 
                  : "No earthquakes match your filters"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr className="text-left">
                      <th className="p-4 font-medium">ID</th>
                      <th className="p-4 font-medium">Magnitude</th>
                      <th className="p-4 font-medium">Location</th>
                      <th className="p-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEarthquakes.length > 0 ? (
                      filteredEarthquakes.map((eq) => (
                        <tr key={eq.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">{eq.id}</td>
                          <td className="p-4">{eq.magnitude.toFixed(1)}</td>
                          <td className="p-4">{eq.location}</td>
                          <td className="p-4">{eq.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                          No earthquakes found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
