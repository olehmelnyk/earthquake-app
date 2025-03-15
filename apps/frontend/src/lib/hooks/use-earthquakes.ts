import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import type { SortDirection, SortField } from '../types/graphql';

// Define the GraphQL query with all the necessary parameters
const EARTHQUAKES_QUERY = gql`
  query GetEarthquakes(
    $filter: EarthquakeFilterInput
    $orderBy: OrderByInput
    $pagination: PaginationInput
  ) {
    earthquakes(filter: $filter, orderBy: $orderBy, pagination: $pagination) {
      edges {
        id
        location
        magnitude
        date
        createdAt
        updatedAt
      }
      pageInfo {
        totalCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export interface EarthquakeFilterInput {
  location?: string;
  magnitude?: {
    min?: number;
    max?: number;
  };
  date?: {
    start?: Date;
    end?: Date;
  };
}

export interface PaginationInput {
  skip?: number;
  take?: number;
}

export interface OrderByInput {
  field: SortField;
  direction: SortDirection;
}

export interface Earthquake {
  id: string;
  location: string;
  magnitude: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageInfo {
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EarthquakesResponse {
  edges: Earthquake[];
  pageInfo: PageInfo;
}

export interface UseEarthquakesOptions {
  filter?: EarthquakeFilterInput;
  orderBy?: OrderByInput;
  pagination?: PaginationInput;
  skip?: boolean;
}

export const useEarthquakes = (options: UseEarthquakesOptions = {}) => {
  const { filter, orderBy, pagination, skip = false } = options;

  // Set default values
  const variables = useMemo(() => {
    return {
      filter,
      orderBy: orderBy || { field: 'date', direction: 'desc' },
      pagination: pagination || { skip: 0, take: 10 },
    };
  }, [filter, orderBy, pagination]);

  const { data, loading, error, refetch } = useQuery<{ earthquakes: EarthquakesResponse }>(
    EARTHQUAKES_QUERY,
    {
      variables,
      skip,
      notifyOnNetworkStatusChange: true,
    }
  );

  const earthquakes = data?.earthquakes.edges || [];
  const pageInfo = data?.earthquakes.pageInfo || { totalCount: 0, hasNextPage: false, hasPreviousPage: false };

  return {
    earthquakes,
    pageInfo,
    loading,
    error,
    refetch,
  };
};
