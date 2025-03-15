/**
 * Simple script to test GraphQL resolvers directly without a server
 */
import { PrismaClient } from '@prisma/client';

async function main() {
  console.log('🔍 Testing Prisma and GraphQL resolvers directly...');
  
  try {
    // Initialize Prisma client with logging
    console.log('⏳ Initializing Prisma client...');
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
    
    console.log('✅ Prisma client initialized');
    
    // Test a simple Prisma query first to validate database connection
    console.log('⏳ Testing direct Prisma query...');
    const count = await prisma.earthquake.count();
    console.log(`✅ Database connection successful. Found ${count} earthquakes.`);
    
    let sampleFields: string[] = [];
    
    if (count === 0) {
      console.log('⚠️ No earthquake records found. You may want to seed the database.');
    } else {
      // Fetch a few earthquakes to inspect the available fields
      console.log('⏳ Fetching sample data to inspect schema...');
      const sample = await prisma.earthquake.findMany({
        take: 1
      });
      
      console.log('✅ Sample earthquake data:');
      console.log(JSON.stringify(sample, null, 2));
      sampleFields = Object.keys(sample[0]);
      console.log('\nAvailable fields:', sampleFields.join(', '));
    }
    
    // Try running a more complex query to test filtering capabilities
    console.log('\n⏳ Testing complex Prisma query with filters...');
    
    const filteredResults = await prisma.earthquake.findMany({
      where: {
        magnitude: {
          gte: 3.0
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: 3
    });
    
    console.log(`✅ Found ${filteredResults.length} earthquakes with magnitude >= 3.0`);
    
    // Clean up
    await prisma.$disconnect();
    console.log('\n👋 Database tests completed successfully!');
    
    // Now try to dynamically import and test the resolvers
    try {
      console.log('\n⏳ Attempting to import GraphQL resolvers...');
      
      // We need to dynamically import to avoid TypeScript errors
      const { resolvers } = await import('../packages/graphql/src/lib/resolvers/index.js');
      console.log('✅ Resolvers imported successfully');
      
      // Create context for resolvers
      const context = { prisma: new PrismaClient() };
      
      console.log('⏳ Executing GraphQL query via resolver...');
      
      // Call the resolver directly
      const result = await resolvers.Query.earthquakes(
        null,
        { pagination: { skip: 0, take: 5 } },
        context
      );
      
      console.log('✅ GraphQL resolver executed successfully!');
      console.log('\nResult:');
      console.log(JSON.stringify(result, null, 2));
      
      // Clean up
      await context.prisma.$disconnect();
    } catch (resolverError) {
      console.error('❌ Error testing GraphQL resolvers:', resolverError);
      console.log('\n⚠️ Resolver test failed, but database connection test was successful.');
      console.log('This suggests there may be a mismatch between GraphQL schema and database schema.');
      
      if (resolverError.message && resolverError.message.includes('Unknown argument')) {
        console.log('\n🔍 Field name mismatch detected! Check that your GraphQL resolver field names match your Prisma schema.');
        console.log('Prisma schema field names:', sampleFields.length > 0 ? sampleFields.join(', ') : 'unknown (no records)');
      }
    }
  } catch (error) {
    console.error('❌ Error during tests:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
