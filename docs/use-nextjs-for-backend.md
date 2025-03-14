# Architecture Decision Record: Using Next.js API Routes for Backend

## Context

For the Earthquake App take-home assignment, we need to decide on a backend architecture. The requirements specify using GraphQL with Apollo Server for the API layer. We have two main options:

1. **Separate Express Server**: Create a standalone Express.js application with Apollo Server that runs independently from the Next.js frontend.
2. **Next.js API Routes**: Leverage Next.js API routes to host the GraphQL endpoint directly within the Next.js application.

This decision impacts development workflow, deployment complexity, and potentially performance.

## Decision

**We will use Next.js API Routes to implement our GraphQL API** instead of creating a separate Express server.

## Rationale

1. **Simplified Development Environment**:
   - Single codebase to manage, eliminating the need to run two separate servers during development
   - Shared TypeScript configuration and dependencies across frontend and backend
   - Easier debugging with all code in one application

2. **Deployment Efficiency**:
   - Only one application to deploy and manage
   - Reduced operational complexity for a take-home assignment
   - No need to set up CORS or worry about cross-origin issues

3. **Performance Considerations**:
   - For a dataset with ~5,000 records, Next.js API routes provide adequate performance
   - API routes can leverage Edge functions for performance if needed
   - Response times will be more than acceptable for the assignment requirements

4. **Take-Home Assignment Context**:
   - Aligns with the directive to prioritize simplicity and demonstration of core skills
   - Allows focus on GraphQL implementation rather than infrastructure setup
   - Showcases knowledge of modern full-stack integration patterns

5. **TypeScript Integration**:
   - Easier to share types between frontend and backend within the same project
   - Consistent type checking across the entire application

## Alternatives Considered

### Separate Express Server

**Pros**:
- Clear separation of concerns between frontend and backend
- Independent scaling of frontend and backend
- More closely resembles larger production architectures

**Cons**:
- Additional complexity in setup and maintenance
- Need to manage two separate development servers
- Configuration overhead for a relatively simple application
- Cross-origin request handling required

### Serverless Functions (outside Next.js)

**Pros**:
- High scalability and pay-per-use pricing
- No server management needed

**Cons**:
- Cold starts could impact user experience
- More complex to set up for a take-home assignment
- Potentially overkill for demonstration purposes

## Implementation Plan

1. Create an API route at `/pages/api/graphql.ts` or `/app/api/graphql/route.ts` (depending on whether we use Pages or App Router)

2. Set up Apollo Server within this route:

```typescript
// Example implementation using Pages Router
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs, resolvers } from '../../graphql';
import { prisma } from '../../lib/prisma';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(server, {
  context: async () => ({ prisma }),
});
```

3. Configure proper error handling and logging within the API route

4. Add comprehensive documentation in the README explaining this architectural choice

## Implications

- All GraphQL operations will be handled through the `/api/graphql` endpoint
- We'll rely on Next.js's built-in API routing capabilities and middleware
- Both frontend and backend will be part of the same deployment unit
- Need to be mindful of API route execution limits in Next.js (default timeout is 10 seconds)

## Future Considerations

If this were to evolve into a production application, we might reconsider this decision based on:

- Scaling requirements beyond what Next.js API routes can efficiently handle
- Need for background processing or long-running operations
- Microservices architecture requirements
- Separate deployment cycles for frontend and backend

## References

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Apollo Server with Next.js Integration](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-integrations)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
