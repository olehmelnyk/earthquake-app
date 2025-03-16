import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  EarthquakeFilters,
  FilterValues,
  DataTable,
  earthquakeColumns,
  EarthquakeTableData,
} from '@earthquake-nx/ui';
import { GET_EARTHQUAKES, GET_FILTER_OPTIONS } from '../../lib/graphql/queries';

// Define interfaces for GraphQL response types
interface MagnitudeRange {
  min: number;
  max: number;
}

interface DateRange {
  earliest: string;
  latest: string;
}

interface FilterOptions {
  locations: string[];
  magnitudeRange: MagnitudeRange;
  dateRange: DateRange;
}

interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  date: string;
}

interface PageInfo {
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface EarthquakesResponse {
  edges: Earthquake[];
  pageInfo: PageInfo;
}

interface EarthquakesData {
  earthquakes: EarthquakesResponse;
}

interface FilterOptionsData {
  filterOptions: FilterOptions;
}

export const EarthquakeDashboard = () => {
  const [filters, setFilters] = useState<FilterValues>({
    location: '',
    minMagnitude: 0,
    maxMagnitude: 10,
    startDate: '',
    endDate: '',
  });

  // Query for filter options
  const { data: filterOptionsData, error: filterOptionsError } =
    useQuery<FilterOptionsData>(GET_FILTER_OPTIONS);

  // Update filters with default values from filter options when available
  useEffect(() => {
    if (filterOptionsData?.filterOptions) {
      const { magnitudeRange, dateRange } = filterOptionsData.filterOptions;
      setFilters((prev) => ({
        ...prev,
        minMagnitude: magnitudeRange.min,
        maxMagnitude: magnitudeRange.max,
        startDate: dateRange.earliest,
        endDate: dateRange.latest,
      }));
    }
    
    // Log any errors with filter options
    if (filterOptionsError) {
      console.error('Error fetching filter options:', filterOptionsError);
    }
  }, [filterOptionsData, filterOptionsError]);

  // Prepare GraphQL variables from filters
  const graphqlVariables = {
    filter: {
      location: filters.location || undefined,
      magnitude: {
        min:
          filters.minMagnitude !== undefined ? filters.minMagnitude : undefined,
        max:
          filters.maxMagnitude !== undefined ? filters.maxMagnitude : undefined,
      },
      date: {
        start: filters.startDate || undefined,
        end: filters.endDate || undefined,
      },
    },
    pagination: {
      skip: 0,
      take: 50, // Fetch up to 50 earthquakes
    },
    orderBy: {
      field: 'date',
      direction: 'desc',
    },
  };

  // Query for earthquakes data
  const { data: earthquakesData, loading, error: earthquakesError } = useQuery<EarthquakesData>(
    GET_EARTHQUAKES,
    { 
      variables: graphqlVariables,
      fetchPolicy: 'network-only', // Don't cache results
    }
  );
  
  // Log GraphQL variables and any errors
  useEffect(() => {
    console.log('GraphQL Variables:', graphqlVariables);
    
    if (earthquakesError) {
      console.error('Error fetching earthquakes:', earthquakesError);
    }
    
    if (earthquakesData) {
      console.log('Received earthquake data:', earthquakesData);
    }
  }, [graphqlVariables, earthquakesData, earthquakesError]);

  // Map to EarthquakeTableData format
  const tableData: EarthquakeTableData[] = earthquakesData?.earthquakes.edges.map(eq => ({
    id: eq.id,
    magnitude: eq.magnitude,
    location: eq.location, // Use location as the primary field
    time: new Date(eq.date).toISOString(), // Convert date to ISO string
    date: eq.date
  })) || [];

  // Calculate statistics
  const earthquakes = earthquakesData?.earthquakes.edges || [];
  const totalCount = earthquakesData?.earthquakes.pageInfo.totalCount || 0;

  const avgMagnitude =
    earthquakes.length > 0
      ? earthquakes.reduce((acc, eq) => acc + eq.magnitude, 0) /
        earthquakes.length
      : 0;

  // Format the latest earthquake date in a more readable way
  const formatLatestEarthquake = (dateString: string): string => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }) + '\n' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  const latestEarthquake =
    earthquakes.length > 0
      ? earthquakes.reduce(
          (latest, eq) =>
            new Date(latest.date) > new Date(eq.date) ? latest : eq,
          earthquakes[0]
        ).date
      : 'N/A';
  
  const formattedLatestEarthquake = formatLatestEarthquake(latestEarthquake);

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
                <p className="text-3xl font-bold">{totalCount}</p>
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
                <p className="text-lg font-bold whitespace-pre-line">{formattedLatestEarthquake}</p>
              </CardContent>
            </Card>
          </div>
            
          {/* Earthquakes Table */}
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>Earthquake Data</CardTitle>
              <CardDescription>
                {loading ? "Loading earthquake data..." : 
                  totalCount > 0 
                    ? `Showing ${Math.min(earthquakes.length, totalCount)} of ${totalCount} earthquakes` 
                    : "No earthquakes match your filters"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 text-center text-muted-foreground">
                  Loading earthquake data...
                </div>
              ) : earthquakes.length > 0 ? (
                <DataTable 
                  columns={earthquakeColumns} 
                  data={tableData}
                  pageSize={10}
                  searchable={true}
                  searchColumn="location"
                />
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  No earthquakes found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
