// Import the Context type from our GraphQL context
import { GraphQLContext } from '../graphql.js';

export const importHistoryResolvers = {
  Query: {
    // Get all import history entries, ordered by most recent first
    importHistory: async (_parent: unknown, _args: unknown, { prisma }: GraphQLContext) => {
      return prisma.importHistory.findMany({
        orderBy: {
          startedAt: 'desc',
        },
      });
    },
  },
};
