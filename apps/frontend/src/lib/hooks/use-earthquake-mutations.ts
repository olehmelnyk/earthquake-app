import { useMutation } from '@apollo/client';
import { 
  CREATE_EARTHQUAKE_MUTATION, 
  UPDATE_EARTHQUAKE_MUTATION, 
  DELETE_EARTHQUAKE_MUTATION,
  CreateEarthquakeInput,
  UpdateEarthquakeInput
} from '../graphql/mutations';
import { GET_EARTHQUAKES, Earthquake } from '../graphql/queries';

// Re-export types for backward compatibility
export type { CreateEarthquakeInput, UpdateEarthquakeInput };

interface UseCreateEarthquakeOptions {
  onSuccess?: (data: { createEarthquake: Earthquake }) => void;
  onError?: (error: Error) => void;
}

export const useCreateEarthquake = (options: UseCreateEarthquakeOptions = {}) => {
  const { onSuccess, onError } = options;

  const [createEarthquake, { loading, error }] = useMutation(
    CREATE_EARTHQUAKE_MUTATION,
    {
      refetchQueries: [{ query: GET_EARTHQUAKES }],
      onCompleted: onSuccess,
      onError,
    }
  );

  const create = async (input: CreateEarthquakeInput) => {
    try {
      const response = await createEarthquake({
        variables: { input },
      });
      return response.data?.createEarthquake;
    } catch (err) {
      console.error('Error creating earthquake:', err);
      throw err;
    }
  };

  return {
    createEarthquake: create,
    loading,
    error,
  };
};

interface UseUpdateEarthquakeOptions {
  onSuccess?: (data: { updateEarthquake: Earthquake }) => void;
  onError?: (error: Error) => void;
}

export const useUpdateEarthquake = (options: UseUpdateEarthquakeOptions = {}) => {
  const { onSuccess, onError } = options;

  const [updateEarthquake, { loading, error }] = useMutation(
    UPDATE_EARTHQUAKE_MUTATION,
    {
      refetchQueries: [{ query: GET_EARTHQUAKES }],
      onCompleted: onSuccess,
      onError,
    }
  );

  const update = async (id: string, input: UpdateEarthquakeInput) => {
    try {
      const response = await updateEarthquake({
        variables: { id, input },
      });
      return response.data?.updateEarthquake;
    } catch (err) {
      console.error('Error updating earthquake:', err);
      throw err;
    }
  };

  return {
    updateEarthquake: update,
    loading,
    error,
  };
};

interface UseDeleteEarthquakeOptions {
  onSuccess?: (data: { deleteEarthquake: boolean }) => void;
  onError?: (error: Error) => void;
}

export const useDeleteEarthquake = (options: UseDeleteEarthquakeOptions = {}) => {
  const { onSuccess, onError } = options;

  const [deleteEarthquake, { loading, error }] = useMutation(
    DELETE_EARTHQUAKE_MUTATION,
    {
      refetchQueries: [{ query: GET_EARTHQUAKES }],
      onCompleted: onSuccess,
      onError,
    }
  );

  const remove = async (id: string) => {
    try {
      const response = await deleteEarthquake({
        variables: { id },
      });
      return response.data?.deleteEarthquake;
    } catch (err) {
      console.error('Error deleting earthquake:', err);
      throw err;
    }
  };

  return {
    deleteEarthquake: remove,
    loading,
    error,
  };
};
