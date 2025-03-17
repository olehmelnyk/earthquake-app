import { NextRequest } from 'next/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { resolvers } from '../../../../../../packages/graphql/src/lib/resolvers';
import { typeDefs } from '../../../../../../packages/graphql/src/lib/schema/typeDefs';

// Initialize Prisma client (only one instance per server)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Create a context for GraphQL operations
interface GraphQLContext {
  prisma: PrismaClient;
}

// Create the Apollo Server with our schema and resolvers
const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection for development
  formatError: (error) => {
    // Log the full error details for debugging
    console.error('GraphQL Error:', JSON.stringify({
      message: error.message,
      path: error.path,
      locations: error.locations,
      extensions: error.extensions,
    }, null, 2));

    // Return a more detailed error for debugging
    return {
      message: error.message,
      path: error.path,
      extensions: error.extensions,
    };
  },
  includeStacktraceInErrorResponses: true, // Include stack traces in development
});

// Create a Next.js API handler for GraphQL
const handler = startServerAndCreateNextHandler(server, {
  context: async () => ({ prisma }),
});

// Export the API handler for POST requests (GraphQL operations)
export async function POST(req: NextRequest) {
  return handler(req);
}

// Support GET requests for Apollo Sandbox/Explorer
export async function GET(req: NextRequest) {
  return handler(req);
}
