import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { handleError } from './utils/error-handling.js';
import type { PrismaClient } from '@prisma/client';

// Export all modules
export * from './schema/typeDefs.js';
export * from './resolvers/index.js';
export * from './utils/error-handling.js';
export * from './types/index.js';

// Context type for resolvers
export interface GraphQLContext {
  prisma: PrismaClient;
}

// Create an Apollo Server instance with typeDefs, resolvers, and error handling
export const createServer = () => {
  return new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    formatError: handleError,
  });
};

// Function to create context for GraphQL requests
export const createContext = (prisma: PrismaClient): GraphQLContext => {
  return {
    prisma,
  };
};

export function graphql(): string {
  return 'graphql';
}
