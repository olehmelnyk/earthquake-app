import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  DataTable,
  earthquakeColumns,
  EarthquakeTableData,
  Button,
  EarthquakeForm,
  EarthquakeFormValues,
  useToast,
  EarthquakeFilters,
  FilterValues,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@earthquake-nx/ui';
import {
  GET_EARTHQUAKES,
  GET_FILTER_OPTIONS,
  EarthquakeFilterInput,
  OrderByInput,
  PaginationInput,
  SortField,
  SortDirection,
  Earthquake as EarthquakeType,
  PageInfo
} from '../../lib/graphql/queries';
import {
  CREATE_EARTHQUAKE_MUTATION,
  UPDATE_EARTHQUAKE_MUTATION,
  DELETE_EARTHQUAKE_MUTATION
} from '../../lib/graphql/mutations';

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

// Use the imported type instead of redefining
type Earthquake = EarthquakeType;

interface EarthquakesResponse {
  edges: Earthquake[];
  pageInfo: PageInfo;
}

export function EarthquakeDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [filter, setFilter] = useState<EarthquakeFilterInput>({});
  const [pagination, setPagination] = useState<PaginationInput>({
    skip: 0,
    take: 10, // Default to 10 records per page
  });
  const [orderBy, setOrderBy] = useState<OrderByInput>({
    field: SortField.date,
    direction: SortDirection.desc,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Ref for debouncing URL updates
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parse query parameters on initial load
  useEffect(() => {
    const locationParam = searchParams.get('location');
    const minMagnitudeParam = searchParams.get('minMagnitude');
    const maxMagnitudeParam = searchParams.get('maxMagnitude');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const skipParam = searchParams.get('skip');
    const takeParam = searchParams.get('take');
    const sortFieldParam = searchParams.get('sortField');
    const sortDirectionParam = searchParams.get('sortDirection');
    const searchParam = searchParams.get('search');

    const newFilter: EarthquakeFilterInput = {};

    if (locationParam) {
      newFilter.location = locationParam;
    }

    if (minMagnitudeParam || maxMagnitudeParam) {
      newFilter.magnitude = {};
      if (minMagnitudeParam) {
        newFilter.magnitude.min = parseFloat(minMagnitudeParam);
      }
      if (maxMagnitudeParam) {
        newFilter.magnitude.max = parseFloat(maxMagnitudeParam);
      }
    }

    if (startDateParam || endDateParam) {
      newFilter.date = {};
      if (startDateParam) {
        newFilter.date.start = startDateParam;
      }
      if (endDateParam) {
        newFilter.date.end = endDateParam;
      }
    }

    if (skipParam) {
      setPagination((prevPagination) => ({ ...prevPagination, skip: parseInt(skipParam) }));
    }

    if (takeParam) {
      setPagination((prevPagination) => ({ ...prevPagination, take: Math.min(parseInt(takeParam), 10) }));
    }

    if (sortFieldParam && sortDirectionParam) {
      // Validate that sortFieldParam is a valid SortField enum value
      const isValidSortField = Object.values(SortField).includes(sortFieldParam as SortField);

      if (isValidSortField) {
        setOrderBy({
          field: sortFieldParam as SortField,
          direction: sortDirectionParam as SortDirection,
        });
      } else {
        // Default to date if invalid sort field
        setOrderBy({
          field: SortField.date,
          direction: sortDirectionParam as SortDirection,
        });
      }
    }

    if (searchParam) {
      setSearchTerm(searchParam);
    }

    setFilter(newFilter);
  }, [searchParams]);

  // GraphQL variables
  const graphqlVariables = {
    filter: {
      ...filter,
      ...(searchTerm ? { location: searchTerm } : {}),
    },
    pagination,
    orderBy,
  };

  // Fetch earthquakes with pagination
  const {
    data: earthquakesData,
    loading: earthquakesLoading,
    error: earthquakesError,
    refetch,
  } = useQuery<{ earthquakes: EarthquakesResponse }>(
    GET_EARTHQUAKES,
    { variables: graphqlVariables }
  );

  // Fetch filter options
  const {
    data: filterOptionsData,
    loading: _filterOptionsLoading,
    error: _filterOptionsError,
  } = useQuery<{ filterOptions: FilterOptions }>(GET_FILTER_OPTIONS);

  // Extract data
  const earthquakes = earthquakesData?.earthquakes?.edges || [];
  const pageInfo = earthquakesData?.earthquakes?.pageInfo || { totalCount: 0, hasNextPage: false, hasPreviousPage: false };
  const filterOptions = filterOptionsData?.filterOptions;

  // Handle filter change
  const handleFilterChange = (values: FilterValues) => {
    // Build new filter object
    const newFilter: EarthquakeFilterInput = {};

    if (values.location) {
      newFilter.location = values.location;
    }

    if (values.minMagnitude !== undefined || values.maxMagnitude !== undefined) {
      newFilter.magnitude = {};
      if (values.minMagnitude !== undefined) {
        newFilter.magnitude.min = values.minMagnitude;
      }
      if (values.maxMagnitude !== undefined) {
        newFilter.magnitude.max = values.maxMagnitude;
      }
    }

    if (values.startDate || values.endDate) {
      newFilter.date = {};
      if (values.startDate) {
        newFilter.date.start = values.startDate;
      }
      if (values.endDate) {
        newFilter.date.end = values.endDate;
      }
    }

    setFilter(newFilter);

    // Reset pagination when filters change
    setPagination({
      skip: 0,
      take: Math.min(pagination.take ?? 10, 10),
    });

    // Update URL with new parameters
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove location parameter
    if (values.location) {
      params.set('location', values.location);
    } else {
      params.delete('location');
    }

    // Update or remove magnitude parameters
    if (values.minMagnitude !== undefined) {
      params.set('minMagnitude', values.minMagnitude.toString());
    } else {
      params.delete('minMagnitude');
    }

    if (values.maxMagnitude !== undefined) {
      params.set('maxMagnitude', values.maxMagnitude.toString());
    } else {
      params.delete('maxMagnitude');
    }

    // Update or remove date parameters
    if (values.startDate) {
      params.set('startDate', values.startDate);
    } else {
      params.delete('startDate');
    }

    if (values.endDate) {
      params.set('endDate', values.endDate);
    } else {
      params.delete('endDate');
    }

    // Reset skip to 0 when filters change
    params.set('skip', '0');

    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle page changes
  const handlePageChange = (newPagination: { skip: number; take: number }) => {
    setPagination({
      skip: newPagination.skip,
      take: Math.min(newPagination.take, 10),
    });

    // Update URL with pagination parameters
    const params = new URLSearchParams(searchParams.toString());
    params.set('skip', newPagination.skip.toString());
    params.set('take', Math.min(newPagination.take, 10).toString());

    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle sorting changes
  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    // Validate that field is a valid SortField enum value
    const isValidSortField = Object.values(SortField).includes(field as SortField);

    // Use the field if valid, otherwise default to date
    const sortField = isValidSortField ? field as SortField : SortField.date;

    setOrderBy({
      field: sortField,
      direction: direction as SortDirection,
    });

    // Update URL with sorting parameters
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortField', sortField);
    params.set('sortDirection', direction);

    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle search changes
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    // Reset pagination when search changes
    setPagination({
      skip: 0,
      take: Math.min(pagination.take ?? 10, 10),
    });

    // Debounce URL updates to prevent losing focus
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      // Update URL with search parameter
      const params = new URLSearchParams(searchParams.toString());

      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }

      // Reset skip to 0 when search changes
      params.set('skip', '0');

      router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    }, 800); // Wait for 800ms of inactivity before updating URL
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Calculate statistics
  const totalEarthquakes = pageInfo?.totalCount || 0;
  const highMagnitudeCount = earthquakes.filter(eq => eq.magnitude >= 5).length;
  const averageMagnitude = earthquakes.length > 0
      ? earthquakes.reduce((acc, eq) => acc + eq.magnitude, 0) /
        earthquakes.length
      : 0;

  // Format the latest earthquake date in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const latestEarthquake = earthquakes.length > 0 ? earthquakes[0] : null;

  const formattedLatestEarthquake = latestEarthquake ? {
    id: latestEarthquake.id,
    location: latestEarthquake.location,
    magnitude: latestEarthquake.magnitude,
    date: formatDate(latestEarthquake.date),
  } : null;

  // State for earthquake form and delete confirmation
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEarthquake, setEditingEarthquake] = useState<EarthquakeFormValues | null>(null);
  const [editingEarthquakeId, setEditingEarthquakeId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [earthquakeToDelete, setEarthquakeToDelete] = useState<string | null>(null);

  // Mutations
  const [createEarthquake] = useMutation(
    CREATE_EARTHQUAKE_MUTATION,
    {
      refetchQueries: [{ query: GET_EARTHQUAKES, variables: graphqlVariables }],
    }
  );

  const [updateEarthquake] = useMutation(
    UPDATE_EARTHQUAKE_MUTATION,
    {
      refetchQueries: [{ query: GET_EARTHQUAKES, variables: graphqlVariables }],
    }
  );

  const [deleteEarthquake] = useMutation(
    DELETE_EARTHQUAKE_MUTATION,
    {
      refetchQueries: [{ query: GET_EARTHQUAKES, variables: graphqlVariables }],
    }
  );

  // Handle form submission
  const handleFormSubmit = (values: EarthquakeFormValues) => {
    console.log("Form submitted with values:", values);

    try {
      // Format date properly for GraphQL
      const dateValue = values.date ? new Date(values.date) : new Date();

      // Ensure values are properly formatted
      const formattedValues = {
        location: values.location.trim(),
        magnitude: typeof values.magnitude === 'number' ? values.magnitude : parseFloat(values.magnitude as unknown as string),
        date: dateValue.toISOString(), // Ensure we send ISO string format to GraphQL
      };

      // Additional validation to ensure data is valid
      if (!formattedValues.location) {
        throw new Error('Location is required');
      }

      if (isNaN(formattedValues.magnitude)) {
        throw new Error('Magnitude must be a valid number');
      }

      console.log("Formatted values for GraphQL:", formattedValues);

      if (editingEarthquakeId) {
        // Update existing earthquake
        console.log("Updating earthquake with ID:", editingEarthquakeId, "and data:", formattedValues);

        updateEarthquake({
          variables: {
            id: editingEarthquakeId,
            input: {
              location: formattedValues.location,
              magnitude: formattedValues.magnitude,
              date: formattedValues.date,
            },
          },
          onCompleted: (data) => {
            if (data && data.updateEarthquake) {
              toast({
                title: "Success",
                description: "Earthquake updated successfully",
              });
              refetch();
              setIsFormOpen(false);
              setEditingEarthquake(null);
              setEditingEarthquakeId(null);
            } else {
              toast({
                title: "Error",
                description: "Failed to update earthquake: No data returned",
                variant: "destructive",
              });
            }
          },
          onError: (error) => {
            console.error("Error updating earthquake:", error);

            // Extract the specific error message if possible
            const errorMessage = error.graphQLErrors?.length > 0
              ? error.graphQLErrors[0].message
              : error.message || "Unknown error occurred";

            toast({
              title: "Error",
              description: `Failed to update earthquake: ${errorMessage}`,
              variant: "destructive",
            });
          },
        });
      } else {
        // Create new earthquake
        console.log("Creating new earthquake with data:", formattedValues);

        createEarthquake({
          variables: {
            input: formattedValues,
          },
          onCompleted: (data) => {
            if (data && data.createEarthquake) {
              console.log("Earthquake created successfully:", data);
              toast({
                title: "Success",
                description: "Earthquake added successfully",
              });
              refetch();
              setIsFormOpen(false);
            } else {
              toast({
                title: "Error",
                description: "Failed to add earthquake: No data returned",
                variant: "destructive",
              });
            }
          },
          onError: (error) => {
            console.error("Error creating earthquake:", error);

            // Extract the specific error message if possible
            const errorMessage = error.graphQLErrors?.length > 0
              ? error.graphQLErrors[0].message
              : error.message || "Unknown error occurred";

            toast({
              title: "Error",
              description: `Failed to add earthquake: ${errorMessage}`,
              variant: "destructive",
            });
          },
        });
      }
    } catch (error) {
      // Handle any errors from our validation
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle edit button click
  const handleEditEarthquake = (earthquake: Earthquake) => {
    console.log("Editing earthquake:", earthquake);
    setEditingEarthquake({
      location: earthquake.location,
      magnitude: earthquake.magnitude,
      date: earthquake.date, // Pass the ISO string directly
    });
    setEditingEarthquakeId(earthquake.id);
    setIsFormOpen(true);
  };

  // Handle delete button click
  const handleDeleteEarthquake = (id: string) => {
    setEarthquakeToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (!earthquakeToDelete) return;

    deleteEarthquake({
      variables: { id: earthquakeToDelete },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Earthquake deleted successfully",
        });
        refetch();
        setDeleteDialogOpen(false);
        setEarthquakeToDelete(null);
      },
      onError: (error) => {
        console.error("Error deleting earthquake:", error);
        toast({
          title: "Error",
          description: `Failed to delete earthquake: ${error.message}`,
          variant: "destructive",
        });
        setDeleteDialogOpen(false);
        setEarthquakeToDelete(null);
      },
    });
  };

  // Prepare data for the table
  const tableData: EarthquakeTableData[] = earthquakes.map((earthquake) => ({
    id: earthquake.id,
    magnitude: earthquake.magnitude,
    location: earthquake.location,
    date: earthquake.date,
    actions: {
      onEdit: () => handleEditEarthquake(earthquake),
      onDelete: () => handleDeleteEarthquake(earthquake.id),
    },
  }));

  // Prepare initial filter values based on query parameters and filter options
  const initialFilters: FilterValues = {
    location: searchParams.get('location') || '',
    minMagnitude: searchParams.get('minMagnitude')
      ? parseFloat(searchParams.get('minMagnitude') as string)
      : (filterOptions?.magnitudeRange?.min || 0),
    maxMagnitude: searchParams.get('maxMagnitude')
      ? parseFloat(searchParams.get('maxMagnitude') as string)
      : (filterOptions?.magnitudeRange?.max || 10),
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Earthquake Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage earthquake data from around the world
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earthquakes
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarthquakes}</div>
            <p className="text-xs text-muted-foreground">
              Recorded in the database
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Magnitude (≥5.0)
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-red-500"
            >
              <path d="M2 12h20M12 2v20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{highMagnitudeCount}</div>
            <p className="text-xs text-muted-foreground">
              Potentially damaging earthquakes
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Magnitude
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-yellow-500"
            >
              <path d="M2 20h.01M7 20v-4" />
              <path d="M12 20v-8" />
              <path d="M17 20v-6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{averageMagnitude}</div>
            <p className="text-xs text-muted-foreground">
              Across all recorded earthquakes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Earthquake */}
      {formattedLatestEarthquake && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Latest Earthquake</CardTitle>
            <CardDescription>
              Most recently recorded seismic activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-muted-foreground">Location</h3>
                <p>{formattedLatestEarthquake.location}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Magnitude</h3>
                <p className="font-semibold">{formattedLatestEarthquake.magnitude.toFixed(1)}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Date</h3>
                <p>{formattedLatestEarthquake.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className="w-full md:w-80">
          <EarthquakeFilters
            onFilterChange={handleFilterChange}
            initialFilters={initialFilters}
            className="space-y-4"
          />
        </div>

        {/* Data Table */}
        <div className="flex-1">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Earthquake Data</CardTitle>
                <CardDescription>
                  A list of all earthquakes in the database
                </CardDescription>
              </div>
              <Button onClick={() => {
                setEditingEarthquake(null);
                setEditingEarthquakeId(null);
                setIsFormOpen(true);
              }}>
                Add Earthquake
              </Button>
            </CardHeader>
            <CardContent>
              {earthquakesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : earthquakesError ? (
                <div className="py-8 text-center text-red-500">
                  Error loading earthquakes: {earthquakesError.message}
                </div>
              ) : (
                <DataTable
                  columns={earthquakeColumns}
                  data={tableData}
                  pageSize={Math.min(pagination.take ?? 10, 10)}
                  searchable={true}
                  searchColumn="location"
                  onPageChange={handlePageChange}
                  onSortChange={handleSortChange}
                  onSearch={handleSearch}
                  currentPagination={{
                    skip: pagination.skip ?? 0,
                    take: Math.min(pagination.take ?? 10, 10),
                  }}
                  currentSorting={orderBy}
                  totalCount={pageInfo?.totalCount || 0}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Earthquake Form Modal */}
      <EarthquakeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialValues={editingEarthquake || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              earthquake record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
