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
      
      // Get the earthquakes based on the query
      const edges = await prisma.earthquake.findMany({
        where,
        orderBy: orderByClause,
        skip: pagination.skip,
        take: pagination.take,
      });

      return {
        edges,
        pageInfo: {
          totalCount,
          hasNextPage: totalCount > pagination.skip + pagination.take,
          hasPreviousPage: pagination.skip > 0,
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
          min: magnitudeData._min.magnitude || 0,
          max: magnitudeData._max.magnitude || 10,
        },
        dateRange: {
          min: dateData._min?.date || null,
          max: dateData._max?.date || null,
        },
      };
    },
  }
};
