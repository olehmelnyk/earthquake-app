import { gql, useMutation } from '@apollo/client';
import type { Earthquake } from './use-earthquakes';

// GraphQL mutation for creating a new earthquake
const CREATE_EARTHQUAKE = gql`
  mutation CreateEarthquake($input: CreateEarthquakeInput!) {
    createEarthquake(input: $input) {
      id
      location
      magnitude
      date
      createdAt
      updatedAt
    }
  }
`;

// GraphQL mutation for updating an existing earthquake
const UPDATE_EARTHQUAKE = gql`
  mutation UpdateEarthquake($id: ID!, $input: UpdateEarthquakeInput!) {
    updateEarthquake(id: $id, input: $input) {
      id
      location
      magnitude
      date
      createdAt
      updatedAt
    }
  }
`;

// GraphQL mutation for deleting an earthquake
const DELETE_EARTHQUAKE = gql`
  mutation DeleteEarthquake($id: ID!) {
    deleteEarthquake(id: $id)
  }
`;

// Types for input data
export interface CreateEarthquakeInput {
  location: string;
  magnitude: number;
  date: Date;
}

export interface UpdateEarthquakeInput {
  location?: string;
  magnitude?: number;
  date?: Date;
}

// Hook for creating a new earthquake
export const useCreateEarthquake = () => {
  const [createEarthquake, { loading, error }] = useMutation<
    { createEarthquake: Earthquake },
    { input: CreateEarthquakeInput }
  >(CREATE_EARTHQUAKE, {
    update: (cache, { data }) => {
      if (data?.createEarthquake) {
        // Update cache logic would go here
        // For now, we'll rely on refetching the query
        cache.modify({
          fields: {
            earthquakes: (existingData = { edges: [], pageInfo: {} }) => {
              return existingData;
            }
          }
        });
      }
    }
  });

  return {
    createEarthquake: (input: CreateEarthquakeInput) => 
      createEarthquake({ variables: { input } }),
    loading,
    error
  };
};

// Hook for updating an earthquake
export const useUpdateEarthquake = () => {
  const [updateEarthquake, { loading, error }] = useMutation<
    { updateEarthquake: Earthquake },
    { id: string; input: UpdateEarthquakeInput }
  >(UPDATE_EARTHQUAKE, {
    update: (cache, { data }) => {
      if (data?.updateEarthquake) {
        // Update the cache for the specific earthquake
        cache.modify({
          id: cache.identify({
            __typename: 'Earthquake',
            id: data.updateEarthquake.id
          }),
          fields: {
            location: () => data.updateEarthquake.location,
            magnitude: () => data.updateEarthquake.magnitude,
            date: () => data.updateEarthquake.date,
            updatedAt: () => data.updateEarthquake.updatedAt
          }
        });
      }
    }
  });

  return {
    updateEarthquake: (id: string, input: UpdateEarthquakeInput) => 
      updateEarthquake({ variables: { id, input } }),
    loading,
    error
  };
};

// Hook for deleting an earthquake
export const useDeleteEarthquake = () => {
  const [deleteEarthquake, { loading, error }] = useMutation<
    { deleteEarthquake: boolean },
    { id: string }
  >(DELETE_EARTHQUAKE, {
    update: (cache, { data }, { variables }) => {
      if (data?.deleteEarthquake && variables?.id) {
        // Remove the deleted earthquake from the cache
        cache.modify({
          fields: {
            earthquakes: (existingData = { edges: [], pageInfo: {} }, { readField }) => {
              const updatedEdges = existingData.edges.filter(
                (edge: { __ref: string }) => readField('id', edge) !== variables.id
              );
              
              return {
                ...existingData,
                edges: updatedEdges,
                pageInfo: {
                  ...existingData.pageInfo,
                  totalCount: existingData.pageInfo.totalCount - 1
                }
              };
            }
          }
        });
        
        // Also remove the individual earthquake from the cache
        cache.evict({ id: cache.identify({ __typename: 'Earthquake', id: variables.id }) });
        cache.gc();
      }
    }
  });

  return {
    deleteEarthquake: (id: string) => deleteEarthquake({ variables: { id } }),
    loading,
    error
  };
};
