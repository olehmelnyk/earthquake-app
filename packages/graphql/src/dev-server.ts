import type { PrismaClient } from '@prisma/client';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './lib/schema/typeDefs.js';
import { resolvers } from './lib/resolvers/index.js';
import { handleError } from './lib/utils/error-handling.js';

// Create context for resolvers
interface GraphQLContext {
  prisma: PrismaClient;
}

async function startDevServer() {
  try {
    // Import prisma directly from the local db package
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });

    // Create an Apollo Server instance
    const server = new ApolloServer<GraphQLContext>({
      typeDefs,
      resolvers,
      formatError: handleError,
      introspection: true, // Enable schema introspection for development
    });

    // Start the standalone server
    const { url } = await startStandaloneServer(server, {
      context: async () => ({ prisma }),
      listen: { port: 4000 }
    });

    console.log(`🚀 GraphQL server ready at: ${url}`);
    console.log(`🔍 Introspection is enabled - explore your schema at ${url}`);
  } catch (error) {
    console.error('❌ Failed to start GraphQL server:');
    console.error(error);
    process.exit(1);
  }
}

// Run the server
startDevServer().catch((err) => {
  console.error('❌ Error starting server:', err);
  process.exit(1);
});
