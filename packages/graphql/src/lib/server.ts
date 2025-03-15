import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import { handleError } from './utils/error-handling';

// Context interface for the GraphQL server
export interface GraphQLContext {
  prisma: PrismaClient;
}

// Configure and create the Apollo Server
export const createApolloServer = (prisma: PrismaClient) => {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    formatError: (formattedError, error) => {
      // Convert the error to a consistent format
      const graphQLError = handleError(error);
      
      // For development, log the full error
      if (process.env.NODE_ENV !== 'production') {
        console.error('GraphQL Error:', error);
      }
      
      // Return a formatted error with a consistent structure
      return {
        message: graphQLError.message,
        path: formattedError.path,
        extensions: graphQLError.extensions,
      };
    },
  });

  return server;
};

// Create the GraphQL context for the Apollo Server
export const createGraphQLContext = (prisma: PrismaClient): GraphQLContext => {
  return {
    prisma,
  };
};
