# Migration Guide: Next.js API Routes to Express Server

## Overview

This document outlines how to migrate the GraphQL API from Next.js API routes to a standalone Express server. While our take-home assignment uses Next.js API routes for simplicity, this guide demonstrates how the codebase is designed for portability if production scaling needs arise.

## Current Architecture (Next.js API Routes)

Our GraphQL implementation follows a modular approach with clear separation of concerns:

```
/packages/                      # Shared packages
  /graphql/                     # GraphQL package
    /schema/                    # GraphQL schema definitions
      earthquake.graphql        # Earthquake type definitions
      index.ts                  # Schema exports
    /resolvers/                 # GraphQL resolvers
      earthquake.resolvers.ts   # Earthquake resolvers
      index.ts                  # Resolver exports
    index.ts                    # Exports schema and resolvers
  /db/                          # Database package
    /prisma/                    # Prisma schema and migrations
    /client/                    # Prisma client exports
      index.ts                  # Exports prisma client

/apps/frontend/                 # Next.js application
  /src
    /pages/api/
      graphql.ts               # Apollo Server configuration in Next.js API route
```

### Key Aspects of Current Implementation

1. **Shared GraphQL package**: Schema and resolvers live in a dedicated package, not tied to any specific app
2. **Shared database package**: Prisma client and schema are in a dedicated package for reuse
3. **Isolated resolver logic**: Resolvers contain business logic independent of server implementation
4. **Dependency injection**: Prisma client is injected into the context rather than imported directly
5. **Clear separation**: GraphQL implementation is separate from the API route configuration

## Migration Steps

### 1. Create Express Server Project with NX

Instead of manually creating the Express server project, use NX CLI to scaffold it properly:

```bash
# From the monorepo root
pnpm nx g @nx/express:application backend \
  --directory=apps/backend \
  --tags="scope:backend,type:app" \
  --bundler=webpack \
  --framework=express \
  --e2eTestRunner=none
```

This command will:
- Create an Express application named 'backend' in the apps/backend directory
- Set appropriate tags for Nx workspace organization
- Configure webpack as the bundler
- Set up Express as the framework
- Skip generating e2e tests (for simplicity)

### 2. Install Required Dependencies

Add Apollo Server and related dependencies that aren't included by the NX generator:

```bash
cd apps/backend
pnpm add @apollo/server @apollo/server/express4 graphql cors
```

These dependencies are needed for our GraphQL implementation since the NX Express generator doesn't include them by default.

### 3. Add Workspace Dependencies

Add references to the shared packages:

```bash
pnpm nx g @nx/js:lib-dependencies backend \
  --deps="@earthquake-app/graphql,@earthquake-app/db"
```

### 4. Update Express Server Entry Point

NX will generate a basic Express app structure. Replace the generated server code in `apps/backend/src/main.ts`:

```typescript
import * as express from 'express';
import * as cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from '@earthquake-app/graphql';
import { prisma } from '@earthquake-app/db';

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server
  await server.start();

  // Apply middleware
  app.use('/graphql', expressMiddleware(server, {
    context: async () => ({ prisma }),
  }));

  const port = process.env.PORT || 4000;
  const serverInstance = app.listen(port, () => {
    console.log(`🚀 Express server running at http://localhost:${port}/graphql`);
  });

  serverInstance.on('error', console.error);
}

startServer().catch(err => console.error('Error starting server:', err));
```

### 5. Update Next.js API Route

The Next.js API route would simply need to use the shared packages:

```typescript
// apps/frontend/src/pages/api/graphql.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs, resolvers } from '@earthquake-app/graphql';
import { prisma } from '@earthquake-app/db';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(server, {
  context: async () => ({ prisma }),
});
```

### 6. Update Frontend Apollo Client

Update Apollo Client in the frontend to point to the new server when needed:

```typescript
// Before (Next.js API route)
const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

// After (Express server)
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql',
  cache: new InMemoryCache(),
});
```

This approach allows you to seamlessly switch between the Next.js API route and Express server by just changing an environment variable.

## Testing the Migration

1. Start the Express server:
```bash
cd apps/backend
pnpm dev
```

2. Verify the GraphQL endpoint is working:
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ earthquakes(limit: 5) { id location magnitude date } }"}'
```

3. Test the frontend with the Express backend by setting the environment variable:
```bash
cd apps/frontend
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql pnpm dev
```

## Architecture Benefits of the Package-Based Approach

The package-based architecture provides several significant benefits:

1. **True Code Sharing**: Both Next.js API routes and Express server use exactly the same code without duplication
2. **No Migration Effort**: Moving from Next.js API to Express requires creating a new app, not copying or moving existing code
3. **Scalability**: Each app can be deployed and scaled independently when needed
4. **Consistent Types**: TypeScript types are shared across all packages and apps
5. **Focused Testing**: Each package can be tested in isolation from server implementation details
6. **Developer Experience**: Devs can work on GraphQL schema and resolvers without worrying about server implementation
7. **Parallel Development**: Frontend and backend teams can work simultaneously with clear boundaries

## NX Workspace Configuration

To properly set up the shared packages in an NX workspace, include the following in your NX configuration:

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test", "e2e"]
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

Make sure the package.json files for each package include the correct workspace references:

```json
// packages/graphql/package.json
{
  "name": "@earthquake-app/graphql",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "graphql": "^16.8.1"
  },
  "peerDependencies": {
    "@earthquake-app/db": "workspace:*"
  }
}

// packages/db/package.json
{
  "name": "@earthquake-app/db",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@prisma/client": "^5.10.2"
  },
  "devDependencies": {
    "prisma": "^5.10.2"
  }
}
```

## Package Scripts

For a complete developer experience, add the following scripts to your root package.json:

```json
{
  "scripts": {
    "dev:next": "nx run frontend:dev",
    "dev:express": "nx run backend:dev",
    "dev:all": "nx run-many --target=dev --projects=frontend,backend --parallel=2",
    "build": "nx run-many --target=build --all",
    "test": "nx run-many --target=test --all"
  }
}
```

## Take-Home Assignment Considerations

For this take-home assignment, the package-based approach demonstrates:

1. **Architectural Thinking**: Shows you're considering future scalability even while choosing simpler options now
2. **Code Organization**: Demonstrates understanding of proper code modularization and separation of concerns
3. **Monorepo Experience**: Showcases familiarity with NX workspace and package management
4. **TypeScript Knowledge**: Well-typed interfaces between packages show TypeScript expertise

While we'll initially use the Next.js API routes for simplicity, this architecture sets up a clear path for future migration if needed - an important consideration for any production application.

## Conclusion

By organizing our GraphQL code in shared packages rather than inside the Next.js app, we've created a more maintainable and flexible architecture. This approach:

1. Eliminates the need to copy code during a potential migration
2. Follows best practices for code organization in monorepos
3. Provides a clear separation of concerns between apps and libraries
4. Demonstrates understanding of enterprise-level architecture considerations

For the take-home assignment, this architecture strikes the right balance between implementation simplicity and proper software design principles.
