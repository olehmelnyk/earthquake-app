import { useQuery } from '@apollo/client';
import { GET_EARTHQUAKE, Earthquake } from '../graphql/queries';

export interface UseEarthquakeOptions {
  id: string;
  skip?: boolean;
}

export const useEarthquake = (options: UseEarthquakeOptions) => {
  const { id, skip = false } = options;

  const { data, loading, error } = useQuery<{ earthquake: Earthquake }>(
    GET_EARTHQUAKE,
    {
      variables: { id },
      skip: skip || !id,
    }
  );

  return {
    earthquake: data?.earthquake || null,
    loading,
    error,
  };
};
