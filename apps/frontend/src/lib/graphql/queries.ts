import { gql } from '@apollo/client';

export const GET_EARTHQUAKE = gql`
  query GetEarthquake($id: ID!) {
    earthquake(id: $id) {
      id
      location
      magnitude
      date
      createdAt
      updatedAt
    }
  }
`;

export const GET_EARTHQUAKES = gql`
  query GetEarthquakes(
    $filter: EarthquakeFilterInput
    $pagination: PaginationInput
    $orderBy: OrderByInput
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

export const GET_FILTER_OPTIONS = gql`
  query GetFilterOptions {
    filterOptions {
      locations
      magnitudeRange {
        min
        max
      }
      dateRange {
        earliest
        latest
      }
    }
  }
`;

// Type definitions for GraphQL queries
export interface EarthquakeFilterInput {
  location?: string;
  magnitude?: {
    min?: number;
    max?: number;
  };
  date?: {
    start?: string;
    end?: string;
  };
}

export interface PaginationInput {
  skip?: number;
  take?: number;
}

export enum SortField {
  location = 'location',
  magnitude = 'magnitude',
  date = 'date',
  createdAt = 'createdAt'
}

export enum SortDirection {
  asc = 'asc',
  desc = 'desc'
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
