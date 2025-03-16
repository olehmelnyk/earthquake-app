import { gql } from '@apollo/client';

export const GET_EARTHQUAKES = gql`
  query GetEarthquakes(
    $filter: EarthquakeFilterInput
    $pagination: PaginationInput
    $orderBy: OrderByInput
  ) {
    earthquakes(filter: $filter, pagination: $pagination, orderBy: $orderBy) {
      edges {
        id
        location
        magnitude
        date
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
