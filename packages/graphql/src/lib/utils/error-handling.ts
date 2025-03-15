import { GraphQLError } from 'graphql';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

// Custom error types for better error handling
export enum ErrorType {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL = 'INTERNAL',
}

// Convert different types of errors to consistent GraphQL errors
export const handleError = (error: unknown): GraphQLError => {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return new GraphQLError('Validation failed', {
      extensions: {
        code: ErrorType.VALIDATION,
        errors: error.errors,
        http: { status: 400 },
      },
    });
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025 is Prisma's "Not Found" error code
    if (error.code === 'P2025') {
      return new GraphQLError('Resource not found', {
        extensions: {
          code: ErrorType.NOT_FOUND,
          http: { status: 404 },
        },
      });
    }

    return new GraphQLError('Database error', {
      extensions: {
        code: ErrorType.DATABASE,
        error: error.message,
        http: { status: 500 },
      },
    });
  }

  // Handle GraphQL errors
  if (error instanceof GraphQLError) {
    return error;
  }

  // Handle generic errors
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return new GraphQLError(errorMessage, {
    extensions: {
      code: ErrorType.INTERNAL,
      http: { status: 500 },
    },
  });
};
