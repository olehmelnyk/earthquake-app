import { ApolloCache, Reference } from '@apollo/client';
import type { Earthquake } from './use-earthquakes';

/**
 * Helper functions for optimistic updates in Apollo cache
 */

interface EarthquakesQueryResult {
  earthquakes: {
    edges: Earthquake[];
    pageInfo: {
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

/**
 * Adds a new earthquake to the cache
 */
export const addEarthquakeToCache = (
  cache: ApolloCache<unknown>,
  newEarthquake: Earthquake
): void => {
  // Read the current query data first
  const queryData = cache.readQuery<EarthquakesQueryResult>({
    query: require('./use-earthquakes').EARTHQUAKES_QUERY,
    variables: {
      pagination: { skip: 0, take: 10 },
      orderBy: { field: 'date', direction: 'desc' }
    }
  });

  if (!queryData) return;

  // Update the cache by adding the new earthquake to the edges
  cache.writeQuery<EarthquakesQueryResult>({
    query: require('./use-earthquakes').EARTHQUAKES_QUERY,
    variables: {
      pagination: { skip: 0, take: 10 },
      orderBy: { field: 'date', direction: 'desc' }
    },
    data: {
      earthquakes: {
        edges: [newEarthquake, ...queryData.earthquakes.edges],
        pageInfo: {
          ...queryData.earthquakes.pageInfo,
          totalCount: queryData.earthquakes.pageInfo.totalCount + 1
        }
      }
    }
  });
};

/**
 * Updates an existing earthquake in the cache
 */
export const updateEarthquakeInCache = (
  cache: ApolloCache<unknown>,
  updatedEarthquake: Earthquake
): void => {
  // Get the normalized cache ID for this earthquake
  const earthquakeId = cache.identify({
    __typename: 'Earthquake',
    id: updatedEarthquake.id
  });

  if (!earthquakeId) return;

  // Update the cache for the specific earthquake
  cache.modify({
    id: earthquakeId,
    fields: {
      location: () => updatedEarthquake.location,
      magnitude: () => updatedEarthquake.magnitude,
      date: () => updatedEarthquake.date,
      updatedAt: () => updatedEarthquake.updatedAt
    }
  });
};

// Type guard to check if an object is an EarthquakeList
function isEarthquakeList(obj: unknown): obj is {
  edges: Reference[];
  pageInfo: {
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
} {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'edges' in obj &&
    Array.isArray((obj as any).edges) &&
    'pageInfo' in obj &&
    typeof (obj as any).pageInfo === 'object' &&
    'totalCount' in (obj as any).pageInfo
  );
}

/**
 * Removes an earthquake from the cache
 */
export const removeEarthquakeFromCache = (
  cache: ApolloCache<unknown>,
  earthquakeId: string
): void => {
  // Remove the earthquake from the list query
  cache.modify({
    fields: {
      earthquakes: (existing: unknown, { readField }) => {
        // If it's not a proper earthquake list, return as is
        if (!isEarthquakeList(existing)) {
          return existing;
        }
        
        // Filter out the earthquake with the given ID
        const newEdges = existing.edges.filter(edge => {
          const id = readField<string>('id', edge);
          return id !== earthquakeId;
        });
        
        return {
          ...existing,
          edges: newEdges,
          pageInfo: {
            ...existing.pageInfo,
            totalCount: Math.max(0, existing.pageInfo.totalCount - 1)
          }
        };
      }
    }
  });

  // Find the ID for the earthquake in the cache
  const cacheId = cache.identify({ __typename: 'Earthquake', id: earthquakeId });
  
  // Remove the individual earthquake from the cache if found
  if (cacheId) {
    cache.evict({ id: cacheId });
    cache.gc(); // Garbage collection
  }
};
