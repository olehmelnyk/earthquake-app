# Why Apollo Server + Prisma Works Without a Separate CRUD Generator

Apollo Server is a GraphQL server library that lets you define a schema (types, queries, mutations) and resolvers (functions that fetch or manipulate data). Prisma, on the other hand, is an ORM that provides a type-safe, database-agnostic API for performing CRUD operations. When combined:

1. **Prisma's Client API:** Prisma generates a fully-typed client (e.g., PrismaClient) based on your schema.prisma. This client includes methods like findMany, create, update, and delete, which align perfectly with GraphQL CRUD needs.
2. **Direct Mapping:** You can map GraphQL queries and mutations directly to Prisma client methods in your resolvers, avoiding the need for a separate tool to generate CRUD boilerplate.
3. **Schema Flexibility:** While some Prisma generators (e.g., for GraphQL SDL) can auto-generate a schema, Apollo Server lets you manually define a schema that matches your Prisma model, giving you full control over the API's shape.

The result? Prisma acts as your data layer, and Apollo Server handles the GraphQL layer, with resolvers acting as a thin glue between them. No extra generator is required because Prisma's API is already CRUD-ready.

---

## Detailed Explanation with Examples

Let's assume your Prisma schema defines an `Earthquake` model:

```prisma
// schema.prisma
model Earthquake {
  id        String   @id @default(uuid())
  location  String
  magnitude Float
  date      DateTime
}
```

Prisma generates a client (`PrismaClient`) with methods like:

- `prisma.earthquake.findMany()` for fetching records.
- `prisma.earthquake.create()` for adding a record.
- `prisma.earthquake.update()` for updating a record.
- `prisma.earthquake.delete()` for deleting a record.

Now, let's set up Apollo Server to use these methods directly.

### Step 1: Define the GraphQL Schema
In Apollo Server v4, you define your schema using SDL (Schema Definition Language) and provide resolvers. Here's a schema for the earthquake CRUD operations:

```graphql
# schema.graphql
type Earthquake {
  id: ID!
  location: String!
  magnitude: Float!
  date: String!
}

type Query {
  earthquakes: [Earthquake!]!
}

type Mutation {
  addEarthquake(location: String!, magnitude: Float!, date: String!): Earthquake!
  updateEarthquake(id: ID!, location: String, magnitude: Float, date: String): Earthquake!
  deleteEarthquake(id: ID!): Boolean!
}
```

### Step 2: Set Up Apollo Server with Prisma

In your backend (e.g., a Next.js API route or standalone Express app), initialize Apollo Server and pass the Prisma client to your resolvers:

```ts
// backend/server.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();
const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

// Define resolvers
const resolvers = {
  Query: {
    earthquakes: async () => {
      return prisma.earthquake.findMany();
    },
  },
  Mutation: {
    addEarthquake: async (_: any, { location, magnitude, date }: { location: string; magnitude: number; date: string }) => {
      return prisma.earthquake.create({
        data: {
          location,
          magnitude,
          date: new Date(date), // Convert string to Date
        },
      });
    },
    updateEarthquake: async (
      _: any,
      { id, location, magnitude, date }: { id: string; location?: string; magnitude?: number; date?: string }
    ) => {
      return prisma.earthquake.update({
        where: { id },
        data: {
          location: location ?? undefined, // Only update if provided
          magnitude: magnitude ?? undefined,
          date: date ? new Date(date) : undefined,
        },
      });
    },
    deleteEarthquake: async (_: any, { id }: { id: string }) => {
      await prisma.earthquake.delete({ where: { id } });
      return true; // Return boolean to indicate success
    },
  },
};

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server (standalone example)
startStandaloneServer(server, { context: async () => ({ prisma }) }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
```

#### How It Works
- Query (`earthquakes`): The resolver calls `prisma.earthquake.findMany()` to fetch all earthquakes. No extra CRUD logic is needed—Prisma handles the database query.
- Mutation (`addEarthquake`): The resolver uses `prisma.earthquake.create()` with the input data, mapping GraphQL arguments to Prisma's data object.
- Mutation (`updateEarthquake`): The resolver uses `prisma.earthquake.update()`, conditionally updating fields based on provided arguments.
- Mutation (`deleteEarthquake`): The resolver calls `prisma.earthquake.delete()` and returns a boolean for simplicity.

Prisma's type safety ensures that the data matches your schema, and Apollo Server exposes it via GraphQL. No separate CRUD generator is needed because Prisma's methods are already tailored for these operations.

### Step 3: Enhancing with Pagination and Validation

To make it production-ready (and meet your assignment's requirements), add pagination and validation:

```ts
// Updated resolvers with pagination and validation
import { z } from 'zod';

const EarthquakeInputSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  magnitude: z.number().positive('Magnitude must be positive'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
});

const resolvers = {
  Query: {
    earthquakes: async (_: any, { offset = 0, limit = 10 }: { offset?: number; limit?: number }) => {
      return prisma.earthquake.findMany({
        skip: offset,
        take: limit,
        orderBy: { date: 'desc' }, // Example sorting
      });
    },
  },
  Mutation: {
    addEarthquake: async (_: any, args: { location: string; magnitude: number; date: string }) => {
      const validated = EarthquakeInputSchema.parse(args); // Throws if invalid
      return prisma.earthquake.create({
        data: {
          location: validated.location,
          magnitude: validated.magnitude,
          date: new Date(validated.date),
        },
      });
    },
    // ... (update and delete resolvers remain similar)
  },
};
```

- **Pagination**: Use `skip` and `take` in Prisma to implement offset-based pagination.
- **Validation**: Use Zod to validate inputs before passing them to Prisma, ensuring data integrity.

---

## Architecture Decision Record (ADR)

### Context
For the Earthquake App project, we need to choose an implementation approach for our GraphQL API. Common options include:

- Manual implementation with Apollo Server and Prisma
- Using code generators like GraphQL Code Generator, TypeGraphQL, or Pothos
- Leveraging a full-stack framework with built-in GraphQL support

### Decision
We will **not** use a dedicated GraphQL code generator and instead will implement resolvers manually using Apollo Server with direct Prisma client integration.

### Rationale
As demonstrated in the examples above, this approach offers several benefits specifically for this take-home assignment:

1. **Reduced Complexity**: The relationship between Apollo Server and Prisma is straightforward without adding another layer of abstraction.

2. **Demonstration of Skills**: Implementing resolvers manually shows a deeper understanding of GraphQL and Prisma fundamentals.

3. **Control and Flexibility**: We have precise control over resolver logic, error handling, and can customize the API as needed.

4. **Performance Optimization**: Direct database access through Prisma allows us to optimize queries (e.g., pagination, filtering).

5. **Time Efficiency**: For a small schema, manual implementation is likely faster than configuring and troubleshooting a generator.

### Alternatives Considered
1. **GraphQL Code Generator**: Would reduce type duplication but add configuration complexity
2. **TypeGraphQL**: Code-first approach that's powerful but introduces additional dependencies
3. **Pothos/Nexus**: Builder pattern with excellent type safety but steeper learning curve

### Implications
- We'll need to manually maintain type consistency between GraphQL Schema and TypeScript
- Resolver implementation will require slightly more boilerplate code
- Future schema changes will require updates in multiple places

### Implementation Plan
1. Define GraphQL schema using SDL (Schema Definition Language)
2. Create resolvers that directly use PrismaClient methods
3. Add validation with Zod for input data
4. Implement pagination, filtering, and error handling manually

---

## Documentation Example

This project leverages Apollo Server and Prisma to implement a GraphQL API for managing earthquakes without a separate CRUD generator. Here's how it works:

### Why Direct Integration?
- **Prisma's Power:** Prisma's `PrismaClient` provides type-safe CRUD methods (e.g., `findMany`, `create`) that map directly to GraphQL operations.
- **Simplified Stack:** No need for additional tools to generate boilerplate—Apollo Server resolvers call Prisma methods directly.

### Code Example
```ts
// Example query resolver
const resolvers = {
  Query: {
    earthquakes: async (_, { limit, offset }) => {
      return prisma.earthquake.findMany({
        take: limit,
        skip: offset,
        orderBy: { date: 'desc' }
      });
    }
  }
};
```

For more details, see the implementation in the `apps/backend/src/graphql` directory.

---

## Decision Record

### Context
When building GraphQL APIs, developers often use code generators to automatically generate resolvers, types, and other boilerplate code from the GraphQL schema. Popular tools include:
- GraphQL Code Generator
- TypeGraphQL
- Nexus
- Pothos (formerly known as GraphQL Nexus)

### Decision
For the Earthquake App project, we've decided **not** to use an Apollo Server code generator, and instead build resolvers manually with Prisma.

### Rationale
1. **Learning Focus**: For a take-home assignment, demonstrating a clear understanding of GraphQL fundamentals is more valuable than showing automated code generation.

2. **Simplicity**: Our schema is relatively small (one main entity with CRUD operations), so the overhead of setting up and learning a generator outweighs the benefits.

3. **Control**: Manual implementation gives us precise control over resolver behavior, error handling, and input validation.

4. **Prisma Integration**: Prisma already provides strongly-typed database access, which eliminates a significant portion of the boilerplate that generators aim to reduce.

5. **Schema-First Approach**: We're favoring a schema-first approach for this project as it provides a clear contract for the API that's easier to review in a take-home context.

### Alternatives Considered
- **GraphQL Code Generator**: Would require additional configuration and potentially add complexity.
- **TypeGraphQL**: Good for code-first approaches but adds another dependency layer.
- **Pothos/Nexus**: Powerful but might be overkill for this project's scope.

### Implications
- More manual coding for resolver implementation
- Need to maintain type consistency between GraphQL schema and TypeScript manually
- Slightly more initial development time

### Future Considerations
For a larger project or production environment, we might reconsider this decision, especially if:
- The schema grows significantly
- We need to maintain multiple related services
- Development velocity becomes a higher priority than demonstrative clarity

---

## Final Thoughts

By using Apollo Server with Prisma directly, you keep your codebase lean and maintainable. Prisma's client is a “CRUD generator” in itself, and Apollo Server lets you expose it via GraphQL with minimal effort.