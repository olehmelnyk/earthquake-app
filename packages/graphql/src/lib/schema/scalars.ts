import { GraphQLScalarType, Kind } from 'graphql';

// Define custom Date scalar for handling Date objects in GraphQL
export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  
  // Convert outgoing Date to ISO string
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error('GraphQL Date Scalar serializer expected a Date object');
  },
  
  // Parse value from client
  parseValue(value: unknown): Date {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error('GraphQL Date Scalar parser expected a string');
  },
  
  // Parse AST literal
  parseLiteral(ast): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error('GraphQL Date Scalar literal expected a string');
  },
});
