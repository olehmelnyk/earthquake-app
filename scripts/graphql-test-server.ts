/**
 * Simple GraphQL server for testing purposes
 */
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

async function startTestServer() {
  console.log('🔍 Starting GraphQL test server...');
  console.log('Working directory:', process.cwd());

  try {
    // Step 1: Initialize Prisma client
    console.log('Step 1: Initializing Prisma client...');
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
    console.log('✅ Prisma client initialized');

    // Step 2: Import GraphQL schema and resolvers
    console.log('Step 2: Importing GraphQL schema and resolvers...');

    // Import the TypeScript files directly
    const { typeDefs } = await import('../packages/graphql/src/lib/schema/typeDefs');
    console.log('✅ TypeDefs imported successfully');

    const { resolvers } = await import('../packages/graphql/src/lib/resolvers/index');
    console.log('✅ Resolvers imported successfully');

    // Step 3: Create Apollo Server
    console.log('Step 3: Creating Apollo Server...');
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      includeStacktraceInErrorResponses: true, // Include stack traces in development
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
    });
    console.log('✅ Apollo Server created');

    // Step 4: Start the server
    console.log('Step 4: Starting standalone server...');
    const { url } = await startStandaloneServer(server, {
      context: async () => ({
        prisma,
      }),
      listen: { port: 4000 },
    });

    console.log(`
    🚀 GraphQL server ready at: ${url}

    Try these sample queries:

    1. Get all earthquakes:
       query {
         earthquakes {
           edges {
             id
             location
             magnitude
             date
           }
           pageInfo {
             totalCount
             hasNextPage
             hasPreviousPage
           }
         }
       }

    2. Get earthquakes with filters:
       query {
         earthquakes(
           filter: { magnitude: { min: 6.0 } }
           orderBy: { field: magnitude, direction: desc }
           pagination: { skip: 0, take: 5 }
         ) {
           edges {
             id
             location
             magnitude
             date
           }
           pageInfo {
             totalCount
           }
         }
       }
    `);

  } catch (error) {
    console.error('❌ Error starting GraphQL test server:', error);
    console.log('\n⚠️ Troubleshooting Tips:');
    console.log('1. Make sure all dependencies are installed: pnpm install');
    console.log('2. Check that the file paths are correct');
    console.log('3. Check the error message for specific issues');
  }
}

startTestServer().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
