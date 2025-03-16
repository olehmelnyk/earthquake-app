import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@earthquake-nx/ui';

interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  date: string;
}

interface FilterValues {
  location: string;
  minMagnitude: number;
  maxMagnitude: number;
  startDate: string;
  endDate: string;
}

export const EarthquakeDashboard = () => {
  // Mock data for demonstration
  const [earthquakes] = useState<Earthquake[]>([
    { id: '1', magnitude: 5.4, location: '37.7749,-122.4194', date: new Date('2023-09-15').toISOString() },
    { id: '2', magnitude: 4.2, location: '34.0522,-118.2437', date: new Date('2023-09-14').toISOString() },
    { id: '3', magnitude: 3.8, location: '47.6062,-122.3321', date: new Date('2023-09-13').toISOString() },
    { id: '4', magnitude: 3.2, location: '45.5051,-122.6750', date: new Date('2023-09-12').toISOString() },
    { id: '5', magnitude: 4.7, location: '32.7157,-117.1611', date: new Date('2023-09-11').toISOString() },
  ]);

  const [filters, setFilters] = useState<FilterValues>({
    location: '',
    minMagnitude: 0,
    maxMagnitude: 10,
    startDate: '',
    endDate: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Format date in a consistent way for server and client
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Find the latest earthquake date
  const getLatestEarthquakeDate = (): string => {
    if (earthquakes.length === 0) return '-';
    const latestDate = new Date(Math.max(...earthquakes.map(eq => new Date(eq.date).getTime())));
    return formatDate(latestDate.toISOString());
  };

  // Common card styling
  const cardStyle = {
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid hsl(var(--border))',
    backgroundColor: 'hsl(var(--card))',
    overflow: 'hidden',
  };

  // Stats card value style
  const statsValueStyle = {
    fontSize: '2.25rem',
    fontWeight: 700,
    marginTop: '0.75rem',
    textAlign: 'center' as const,
  };

  return (
    <div style={{ 
      width: '100%', 
      padding: '1.5rem',
      boxSizing: 'border-box',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(1, 1fr)', 
        gap: '1.5rem',
        width: '100%'
      }}>
        {/* Grid for desktop layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(0, 3fr)',
          gap: '1.5rem',
          width: '100%'
        }}>
          {/* Filter Card */}
          <div>
            <Card style={cardStyle}>
              <CardHeader style={{ padding: '1.5rem 1.5rem 0.75rem 1.5rem' }}>
                <CardTitle style={{ fontSize: '1.25rem', fontWeight: '600' }}>Filter Earthquakes</CardTitle>
                <CardDescription style={{ marginTop: '0.25rem' }}>Narrow down earthquake data based on specific criteria</CardDescription>
              </CardHeader>

              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.75rem 1.5rem' }}>
                <div>
                  <label htmlFor="location" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    placeholder="e.g., 37.7749,-122.4194"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'hsl(var(--background))',
                      boxSizing: 'border-box'
                    }}
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="minMagnitude" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                    Minimum Magnitude
                  </label>
                  <input
                    id="minMagnitude"
                    type="number"
                    min="0"
                    step="0.1"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'hsl(var(--background))',
                      boxSizing: 'border-box'
                    }}
                    value={filters.minMagnitude}
                    onChange={(e) => setFilters({ ...filters, minMagnitude: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label htmlFor="maxMagnitude" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                    Maximum Magnitude
                  </label>
                  <input
                    id="maxMagnitude"
                    type="number"
                    min="0"
                    step="0.1"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'hsl(var(--background))',
                      boxSizing: 'border-box'
                    }}
                    value={filters.maxMagnitude}
                    onChange={(e) => setFilters({ ...filters, maxMagnitude: parseFloat(e.target.value) || 10 })}
                  />
                </div>

                <div>
                  <label htmlFor="startDate" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'hsl(var(--background))',
                      boxSizing: 'border-box'
                    }}
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="endDate" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'hsl(var(--background))',
                      boxSizing: 'border-box'
                    }}
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  />
                </div>
              </CardContent>

              <CardFooter style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem 1.5rem 1.5rem' }}>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                  onClick={() => {
                    console.log('Applying filters:', filters);
                    // In a real app, this would trigger API fetch with filters
                  }}
                >
                  Apply Filters
                </button>

                <button
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: 'hsl(var(--foreground))',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: '1px solid hsl(var(--border))'
                  }}
                  onClick={() => {
                    setFilters({
                      location: '',
                      minMagnitude: 0,
                      maxMagnitude: 10,
                      startDate: '',
                      endDate: '',
                    });
                  }}
                >
                  Reset
                </button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div>
            {/* Stats Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <Card style={cardStyle}>
                <CardHeader style={{ padding: '1.25rem 1.25rem 0.25rem', textAlign: 'center' }}>
                  <CardTitle style={{ fontSize: '1rem', fontWeight: 600 }}>Total Earthquakes</CardTitle>
                </CardHeader>
                <CardContent style={{ padding: '0.25rem 1.25rem 1.5rem', textAlign: 'center' }}>
                  <div style={statsValueStyle}>{earthquakes.length}</div>
                </CardContent>
              </Card>

              <Card style={cardStyle}>
                <CardHeader style={{ padding: '1.25rem 1.25rem 0.25rem', textAlign: 'center' }}>
                  <CardTitle style={{ fontSize: '1rem', fontWeight: 600 }}>Average Magnitude</CardTitle>
                </CardHeader>
                <CardContent style={{ padding: '0.25rem 1.25rem 1.5rem', textAlign: 'center' }}>
                  <div style={statsValueStyle}>
                    {earthquakes.length > 0
                      ? (
                          earthquakes.reduce((sum, eq) => sum + eq.magnitude, 0) / earthquakes.length
                        ).toFixed(1)
                      : '-'}
                  </div>
                </CardContent>
              </Card>

              <Card style={cardStyle}>
                <CardHeader style={{ padding: '1.25rem 1.25rem 0.25rem', textAlign: 'center' }}>
                  <CardTitle style={{ fontSize: '1rem', fontWeight: 600 }}>Latest Earthquake</CardTitle>
                </CardHeader>
                <CardContent style={{ padding: '0.25rem 1.25rem 1.5rem', textAlign: 'center' }}>
                  <div style={statsValueStyle}>{getLatestEarthquakeDate()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Earthquake Table */}
            <Card style={cardStyle}>
              <CardHeader style={{ padding: '1.5rem 1.5rem 0.75rem' }}>
                <CardTitle style={{ fontSize: '1.25rem', fontWeight: 600 }}>Earthquake Data</CardTitle>
                <CardDescription style={{ marginTop: '0.25rem' }}>
                  Showing {Math.min(5, earthquakes.length)} of {earthquakes.length} earthquakes
                </CardDescription>
              </CardHeader>
              <CardContent style={{ padding: '0.75rem 1.5rem' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid hsl(var(--border))', backgroundColor: 'hsla(var(--muted), 0.5)' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))', letterSpacing: '0.05em' }}>
                          Magnitude
                        </th>
                        <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))', letterSpacing: '0.05em' }}>
                          Location
                        </th>
                        <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))', letterSpacing: '0.05em' }}>
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {earthquakes.slice(0, 5).map((earthquake) => (
                        <tr key={earthquake.id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                          <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{earthquake.magnitude.toFixed(1)}</td>
                          <td style={{ padding: '1rem' }}>{earthquake.location}</td>
                          <td style={{ padding: '1rem' }}>{formatDate(earthquake.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                  <button
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: 'hsl(var(--foreground))',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      border: '1px solid hsl(var(--border))'
                    }}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span style={{ padding: '0 1rem' }}>
                    Page {currentPage} of {Math.ceil(earthquakes.length / 5)}
                  </span>
                  <button
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: 'hsl(var(--foreground))',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      border: '1px solid hsl(var(--border))'
                    }}
                    onClick={() => setCurrentPage(Math.min(Math.ceil(earthquakes.length / 5), currentPage + 1))}
                    disabled={currentPage === Math.ceil(earthquakes.length / 5)}
                  >
                    Next
                  </button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
