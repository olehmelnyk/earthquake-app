import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { 
  GET_EARTHQUAKES, 
  EarthquakeFilterInput, 
  OrderByInput, 
  PaginationInput, 
  EarthquakesResponse,
  Earthquake,
  PageInfo,
  SortField,
  SortDirection
} from '../graphql/queries';

// Re-export types for backward compatibility
export type { 
  EarthquakeFilterInput, 
  OrderByInput, 
  PaginationInput, 
  EarthquakesResponse,
  Earthquake,
  PageInfo,
  SortField,
  SortDirection
};

export interface UseEarthquakesOptions {
  filter?: EarthquakeFilterInput;
  orderBy?: OrderByInput;
  pagination?: PaginationInput;
  skip?: boolean;
}

export const useEarthquakes = (options: UseEarthquakesOptions = {}) => {
  const { filter, orderBy, pagination, skip = false } = options;

  const variables = useMemo(() => ({
    filter,
    orderBy,
    pagination,
  }), [filter, orderBy, pagination]);

  const { data, loading, error, refetch } = useQuery<{ earthquakes: EarthquakesResponse }>(
    GET_EARTHQUAKES,
    {
      variables,
      skip,
    }
  );

  const earthquakes = data?.earthquakes?.edges || [];
  const pageInfo = data?.earthquakes?.pageInfo || { 
    totalCount: 0, 
    hasNextPage: false, 
    hasPreviousPage: false 
  };

  return {
    earthquakes,
    pageInfo,
    loading,
    error,
    refetch,
  };
};
