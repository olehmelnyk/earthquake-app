import type {
  EarthquakeFilterInput,
  PaginationInput,
  OrderByInput,
} from '../types/index.js';
import { GraphQLContext } from '../graphql.js';

interface WhereClause {
  location?: {
    contains: string;
    mode: 'insensitive';
  };
  magnitude?: {
    gte?: number;
    lte?: number;
  };
  date?: {
    gte?: Date;
    lte?: Date;
  };
}

interface PageInfo {
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface EarthquakesResponse {
  edges: any[];
  pageInfo: PageInfo;
}

export const earthquakeResolvers = {
  Query: {
    // Get earthquake by ID
    earthquake: async (_parent: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
      return prisma.earthquake.findUnique({
        where: { id },
      });
    },

    // Get earthquakes with filtering, pagination, and sorting
    earthquakes: async (
      _parent: unknown,
      { filter = {}, pagination = { skip: 0, take: 10 }, orderBy = { field: 'date', direction: 'desc' } }: {
        filter?: EarthquakeFilterInput;
        pagination?: PaginationInput;
        orderBy?: OrderByInput;
      },
      { prisma }: GraphQLContext
    ): Promise<EarthquakesResponse> => {
      // Build where clause for our query
      const where: WhereClause = {};

      // Apply location filter (case-insensitive contains)
      if (filter.location) {
        where.location = {
          contains: filter.location,
          mode: 'insensitive',
        };
      }

      // Apply magnitude range filters
      if (filter.magnitude?.min !== undefined || filter.magnitude?.max !== undefined) {
        where.magnitude = {};

        if (filter.magnitude.min !== undefined) {
          where.magnitude.gte = filter.magnitude.min;
        }

        if (filter.magnitude.max !== undefined) {
          where.magnitude.lte = filter.magnitude.max;
        }
      }

      // Apply date range filters
      if (filter.date?.start || filter.date?.end) {
        where.date = {};

        if (filter.date.start) {
          where.date.gte = new Date(filter.date.start);
        }

        if (filter.date.end) {
          where.date.lte = new Date(filter.date.end);
        }
      }

      // Prepare the orderBy clause
      const orderByClause = {
        [orderBy.field]: orderBy.direction,
      };

      // Get total count of earthquakes for pagination
      const totalCount = await prisma.earthquake.count({ where });

      // Enforce maximum limit of 10 records per page
      const take = Math.min(pagination.take || 10, 10);

      // Get the earthquakes based on the query
      const edges = await prisma.earthquake.findMany({
        where,
        orderBy: orderByClause,
        skip: pagination.skip || 0,
        take,
      });

      return {
        edges,
        pageInfo: {
          totalCount,
          hasNextPage: totalCount > (pagination.skip || 0) + take,
          hasPreviousPage: (pagination.skip || 0) > 0,
        },
      };
    },

    // Get filter options for the earthquake list
    filterOptions: async (_parent: unknown, _args: unknown, { prisma }: GraphQLContext) => {
      // Get the unique locations
      const locations = await prisma.earthquake.findMany({
        select: {
          location: true,
        },
        distinct: ['location'],
        orderBy: {
          location: 'asc',
        },
      });

      // Extract unique locations
      const locationData = locations.map(item => item.location).filter(Boolean);

      // Get magnitude range
      const magnitudeData = await prisma.earthquake.aggregate({
        _min: { magnitude: true },
        _max: { magnitude: true },
      });

      // Get date range
      const dateData = await prisma.earthquake.aggregate({
        _min: { date: true },
        _max: { date: true },
      });

      return {
        locations: locationData,
        magnitudeRange: {
          min: magnitudeData._min.magnitude || 0.1,
          max: magnitudeData._max.magnitude || 10,
        },
        dateRange: {
          earliest: dateData._min?.date || new Date(0),
          latest: dateData._max?.date || new Date(),
        },
      };
    },
  },

  Mutation: {
    // Create a new earthquake
    createEarthquake: async (
      _parent: unknown,
      { input }: { input: { location: string; magnitude: number; date: string } },
      { prisma }: GraphQLContext
    ) => {
      console.log('Create earthquake request received with input:', JSON.stringify(input));

      try {
        // Validate required fields
        if (!input.location || input.magnitude === undefined || !input.date) {
          throw new Error('All fields are required: location, magnitude, and date');
        }

        // Validate location format (should include latitude and longitude)
        if (!input.location.includes(',')) {
          throw new Error('Location must include both latitude and longitude separated by a comma (e.g., "37.7749, -122.4194")');
        }

        // Validate magnitude (should be greater than 0)
        if (typeof input.magnitude !== 'number' || isNaN(input.magnitude) || input.magnitude <= 0) {
          throw new Error('Magnitude must be a positive number');
        }

        // Validate date
        let dateObj: Date;
        try {
          dateObj = new Date(input.date);
          if (isNaN(dateObj.getTime())) {
            throw new Error(`Invalid date format: ${input.date}`);
          }
        } catch (dateError) {
          console.error('Date parsing error:', dateError);
          throw new Error(`Invalid date format: ${input.date}`);
        }

        console.log('Creating earthquake with validated data:', {
          location: input.location,
          magnitude: input.magnitude,
          date: dateObj
        });

        // Create the earthquake
        const newEarthquake = await prisma.earthquake.create({
          data: {
            location: input.location,
            magnitude: input.magnitude,
            date: dateObj,
          },
        });

        console.log('Created earthquake:', newEarthquake);
        return newEarthquake;
      } catch (error) {
        console.error('Error creating earthquake:', error);
        // Re-throw the error to be handled by Apollo Server
        throw error;
      }
    },

    // Update an existing earthquake
    updateEarthquake: async (
      _parent: unknown,
      { id, input }: { id: string; input: { location?: string; magnitude?: number; date?: string } },
      { prisma }: GraphQLContext
    ) => {
      console.log('Update earthquake request received with ID:', id, 'and input:', JSON.stringify(input));

      try {
        // Validate ID
        if (!id) {
          throw new Error('Earthquake ID is required');
        }

        // Check if earthquake exists
        const existingEarthquake = await prisma.earthquake.findUnique({
          where: { id },
        });

        if (!existingEarthquake) {
          throw new Error(`Earthquake with ID ${id} not found`);
        }

        console.log('Found existing earthquake:', existingEarthquake);

        // Prepare update data
        const updateData: { location?: string; magnitude?: number; date?: Date } = {};

        // Validate and process location if provided
        if (input.location !== undefined) {
          if (input.location.trim() === '') {
            throw new Error('Location cannot be empty');
          }

          // Validate location format (should include latitude and longitude)
          if (!input.location.includes(',')) {
            throw new Error('Location must include both latitude and longitude separated by a comma (e.g., "37.7749, -122.4194")');
          }

          updateData.location = input.location.trim();
        }

        // Validate and process magnitude if provided
        if (input.magnitude !== undefined) {
          if (typeof input.magnitude !== 'number' || isNaN(input.magnitude)) {
            throw new Error('Magnitude must be a valid number');
          }

          // Magnitude should be greater than 0
          if (input.magnitude <= 0) {
            throw new Error('Magnitude must be a positive number');
          }

          updateData.magnitude = input.magnitude;
        }

        // Validate and process date if provided
        if (input.date !== undefined) {
          try {
            const dateObj = new Date(input.date);
            if (isNaN(dateObj.getTime())) {
              throw new Error(`Invalid date format: ${input.date}`);
            }
            updateData.date = dateObj;
            console.log('Parsed date for update:', dateObj, 'from input:', input.date);
          } catch (dateError) {
            console.error('Date parsing error:', dateError);
            throw new Error(`Invalid date format: ${input.date}`);
          }
        }

        // Make sure we have at least one field to update
        if (Object.keys(updateData).length === 0) {
          throw new Error('No valid fields provided for update');
        }

        console.log('Updating earthquake with data:', updateData);

        // Update the earthquake
        const updatedEarthquake = await prisma.earthquake.update({
          where: { id },
          data: updateData,
        });

        console.log('Updated earthquake:', updatedEarthquake);
        return updatedEarthquake;
      } catch (error) {
        console.error('Error updating earthquake:', error);
        // Re-throw the error to be handled by Apollo Server
        throw error;
      }
    },

    // Delete an earthquake
    deleteEarthquake: async (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ) => {
      try {
        // Validate that the earthquake exists
        const existingEarthquake = await prisma.earthquake.findUnique({
          where: { id },
        });

        if (!existingEarthquake) {
          throw new Error(`Earthquake with ID ${id} not found`);
        }

        // Delete the earthquake
        await prisma.earthquake.delete({
          where: { id },
        });

        return true;
      } catch (error) {
        console.error('Error deleting earthquake:', error);
        // Re-throw with a more user-friendly message if it's not already an Error object
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error('An unexpected error occurred while deleting the earthquake');
        }
      }
    },

    // Batch delete earthquakes
    batchDeleteEarthquakes: async (
      _parent: unknown,
      { ids }: { ids: string[] },
      { prisma }: GraphQLContext
    ) => {
      try {
        if (!ids || ids.length === 0) {
          throw new Error('No IDs provided for batch deletion');
        }

        const result = await prisma.earthquake.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        });

        return result.count;
      } catch (error) {
        console.error('Error batch deleting earthquakes:', error);
        // Re-throw with a more user-friendly message if it's not already an Error object
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error('An unexpected error occurred while batch deleting earthquakes');
        }
      }
    },
  },
};
