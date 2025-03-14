import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Validation schema for environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

// Global type declaration for PrismaClient instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Instantiate PrismaClient with proper logging based on environment
export const prisma = global.prisma || 
  new PrismaClient({
    log: env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

// In development, store the client on the global object to prevent
// multiple instances during hot-reloading
if (env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

// Helper types for working with Prisma models
export type Earthquake = NonNullable<Awaited<ReturnType<typeof prisma.earthquake.findUnique>>>;
export type ImportHistory = NonNullable<Awaited<ReturnType<typeof prisma.importHistory.findUnique>>>;

// Export the Prisma client methods by model for better abstraction
export const db = {
  earthquake: prisma.earthquake,
  importHistory: prisma.importHistory,
};

// Helper function to safely disconnect from the database
export const disconnect = async (): Promise<void> => {
  await prisma.$disconnect();
};
