import { gql, useQuery } from '@apollo/client';
import type { Earthquake } from './use-earthquakes';

const EARTHQUAKE_QUERY = gql`
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

export interface UseEarthquakeOptions {
  id: string;
  skip?: boolean;
}

export const useEarthquake = (options: UseEarthquakeOptions) => {
  const { id, skip = false } = options;

  const { data, loading, error } = useQuery<{ earthquake: Earthquake }>(
    EARTHQUAKE_QUERY,
    {
      variables: { id },
      skip: skip || !id,
    }
  );

  return {
    earthquake: data?.earthquake,
    loading,
    error,
  };
};
