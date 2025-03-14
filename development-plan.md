# Development Plan
## Take-Home Priorities and Focus Areas

1. **Core Requirements First:**
   - Ensure all required CRUD operations work flawlessly
   - Verify CSV import functions correctly
   - Make sure API and frontend are well-integrated

2. **Polish and Presentation:**
   - Create a clean, professional UI that's easy to navigate
   - Ensure error states are handled gracefully
   - Write a clear, comprehensive README

3. **Code Quality:**
   - Use strong TypeScript types throughout
   - Follow best practices for GraphQL implementation
   - Organize code in a maintainable way

4. **Time Management:**
   - Focus on completing core functionality first
   - Add extra features only if time permits
   - Document any known limitations or future improvements

---

## Potential Hidden Pitfalls
### CSV Import:
- **Issue:** Inconsistent data (e.g., malformed dates, missing fields) could break the import.
- **Solution:** Add error logging and skip invalid rows with warnings.

### GraphQL N+1:
- **Issue:** Unoptimized resolvers could slow down list queries.
- **Solution:** Use DataLoader or Prisma joins.

### Database Performance:
- **Issue:** Unindexed queries on 5,304 records could be slow.
- **Solution:** Add indexes on `location`, `magnitude`, and `date` in Prisma.

### Frontend Rendering:
- **Issue:** Rendering 5,000+ rows could lag.
- **Solution:** Implement pagination.

### Validation:
- **Issue:** Missing client/server validation could allow bad data.
- **Solution:** Enforce Zod validation on both ends.

### Docker:
- **Issue:** Misconfiguration could prevent DB access.
- **Solution:** Test connectivity locally and document setup steps.

### Security:
- **Issue:** GraphQL endpoints vulnerable to abuse.
- **Solution:** Implement rate limiting and input sanitization.

### Accessibility:
- **Issue:** UI components not accessible to all users.
- **Solution:** Follow WCAG guidelines and test with accessibility tools.

-----

## Additional Notes
  - **Redis**: Skip unless performance issues arise, as PostgreSQL should handle this scale.
- **README**: Include setup instructions (e.g., `pnpm install`, `docker-compose up`, `npx prisma migrate dev`, `pnpm run dev`), Node.js version (e.g., 22.x), and architecture decisions.
- **Best Practices**: Use TypeScript strict mode, linting, and consistent formatting.
- **Git Workflow**: Consider implementing Conventional Commits for better changelog generation.
- **Developer Experience**: Add comprehensive scripts in package.json for common tasks.

## [ ]  Milestone 1: Requirements Gathering, Investigation, and Development Planning

### Objective: Clarify requirements, investigate architectural options, and plan the development process.

- [x] **1. Backend Architecture Decision**:

  - The task specifies using Express with Apollo Server for the backend, but since Next.js is required for the frontend, explore integrating the GraphQL API into Next.js using its API routes. This avoids managing two separate servers, simplifying deployment and development.
  - **Investigation**: Research the feasibility, pros (e.g., unified codebase, easier local development), and cons (e.g., potential scalability limitations for complex backends) of hosting the backend within Next.js.
  - **Decision**: We will use Next.js API routes for the GraphQL backend as documented in `docs/use-nextjs-for-backend.md`. This simplifies development and deployment while being sufficient for the assignment's requirements.
  - **Migration Path**: While using Next.js API routes is optimal for this take-home assignment, the code should be structured to allow easy migration to a standalone Express server if needed in the future. GraphQL resolvers and schema will be isolated from the API route implementation to ensure portability.
  - **Action Item**: Create a brief migration guide in `docs/nextjs-to-express-migration.md` outlining how the codebase could be adapted for a standalone Express backend if needed for production scaling.
  - **Output**: Document findings in `docs/use-nextjs-for-backend.md`.

- [x] **2. Database Selection**:

  - Choose PostgreSQL as the database due to its robustness, support for complex queries, and compatibility with Prisma (an ORM that streamlines database interactions).
  - Reasoning: It meets the requirement of a non-file-based database and is widely adopted, making it a practical choice.
  - **Alternative Options**:
    - Consider SQLite for local development to simplify setup
    - Document trade-offs between PostgreSQL vs MongoDB for this specific use case

- [ ] **3. GraphQL Considerations**:
  - **N+1 Query Problem**: In GraphQL, nested resolvers can lead to multiple database queries. For this take-home assignment, we'll document potential solutions (DataLoader, Prisma's include) in `docs/graphql-performance-considerations.md` but skip implementation due to the limited dataset size (~5000 records).
  - **Implementation Approach**: Compare code-first vs schema-first approaches and document decision
  - **GraphQL Codegen**: Evaluate using GraphQL Codegen for automatic type generation from schema
  - **Manual Implementation**: As documented in `docs/apollo-server-prisma-integration.md`, we've decided to implement Apollo Server resolvers manually rather than using a code generator, as this approach offers better control, simplicity, and learning demonstration for this take-home assignment.
  - **Security**: Add input sanitization to prevent GraphQL injection attacks and rate limiting for API endpoints
  - **Output**: Note findings and chosen approach in the backend documentation.

- [ ] **4. Prisma Generators:**
  - Enhance development with Prisma generators:
    - TypeScript Types: Use `prisma-generator-typescript-interfaces` for type safety.
    - Documentation: Use `prisma-docs-generator` for schema documentation.
    - Zod Validations: Use `prisma-zod-generator` to generate Zod schemas for input validation.
    - GraphQL Schema: Apollo Server can leverage Prisma directly, so a separate CRUD generator may not be needed.
    - **Investigation**: Assess which generators align with the project's needs and avoid overcomplicating the setup.
    - **Output**: Document findings in `prisma/generators.md`.

- [x] **5. CSV Data Handling**:
  - The CSV file contains 5,304 entries, which is substantial but manageable in a single operation for a take-home assignment.
  - **Plan**: Develop a script to download the CSV from the provided URL (https://data.humdata.org/dataset/4881d82b-ba63-4515-b748-c364f3d05b42/resource/10ac8776-5141-494b-b3cd-bf7764b2f964/download/earthquakes1970-2014.csv) and generate a Prisma seed file.
  - **Fields to Map**: Based on the CSV schema example, extract `DateTime` (as date), `Latitude`/`Longitude` (combine into `location` string), and `Magnitude`. Ignore unused fields like `Depth`, `MagType`, etc., unless specified.
  - **Data Validation**: Implement validation for CSV data (e.g., check for malformed dates, missing fields)
  - **Output**: Generate a seed file in `prisma/seed.ts` with the formatted earthquake data.
  - **Status**: Complete - Script created with data validation using Zod, successfully imports 5,304 earthquake records.

- [ ] **6. Caching with Redis**:
  - **Evaluation**: Redis could cache frequent read operations (e.g., earthquake list queries), but for a CRUD app with 5,304 records, PostgreSQL's indexing and query optimization might suffice.
  - **Decision**: Likely overkill unless performance tests show significant bottlenecks. Document pros (e.g., faster reads) and cons (e.g., added complexity) in `docs/redis-usage.md`.

- [x] **7. Instruction Files**:
  - Create `.cursorrules` with AI instructions for best practices (e.g., TypeScript strict mode, ESLint rules, Prettier formatting).
  - Symlink it to `.windsurfrules` for consistency: `ln -s .cursorrules .windsurfrules`.

- [ ] **8. Additional Considerations**:
  - **Data Validation**: Validate CSV data and user inputs (e.g., magnitude as a positive number, valid date formats).
  - **Error Handling**: Return meaningful GraphQL errors (e.g., ValidationError, NotFoundError).
  - **Performance**: Plan for pagination and filtering in the earthquake list to handle the dataset efficiently.
  - **Monitoring & Logging**:
    - Plan for structured logging with Winston or Pino
    - Set up error monitoring with Sentry or similar for production
    - Add health check endpoints
  - **Authentication Framework**: Document potential future auth implementation approach
  - **Output**: Document findings in `docs/additional-considerations.md`.

### Definition of Done for Milestone 1:
- Architecture decisions are documented
- Database schema is designed
- CSV import strategy is planned
- Key technical considerations are addressed

## [x] Milestone 2: Project Scaffolding

### Objective: Set up the project structure and necessary infrastructure.

- [x] **1. Monorepo Setup**:
  - Configure NX workspace with pnpm as package manager
  - Configure ESLint/Prettier for consistent formatting
  - Set up Git hooks for pre-commit linting and formatting
  - **Output**: Functioning NX monorepo with Next.js application and shared package structure

- [x] **2. Next.js Frontend Setup**:
  ```bash
  # From the monorepo root, create a Next.js app with proper configuration
  pnpm nx g @nx/next:application frontend \
    --directory=apps/frontend \
    --tags="scope:frontend,type:app" \
    --style=css \
    --appDir \
    --e2eTestRunner=playwright
  ```
  - Configure Tailwind CSS for styling
  - Set up Shadcn UI for component library
  - Add Apollo Client for GraphQL integration
  - Configure proper project structure in line with NX best practices
  - **Output**: Next.js frontend application with Tailwind CSS and Shadcn UI setup

- [x] **3. Shared Packages Setup**:
  ```bash
  # Create shared packages for reusable code
  pnpm nx g @nx/js:library graphql --directory=packages/graphql --tags="scope:shared,type:lib"
  pnpm nx g @nx/js:library db --directory=packages/db --tags="scope:shared,type:lib"
  pnpm nx g @nx/react:library ui --directory=packages/ui --tags="scope:shared,type:lib" --style=css
  ```
  - Configure Prisma in the `db` package
  - Set up GraphQL schema and resolvers in the `graphql` package
  - Create base UI components in the `ui` package using Shadcn UI
  - **Output**: Shared packages for GraphQL, database, and UI components

- [x] **4. Docker Setup**:
  - Create Docker Compose file for PostgreSQL database
  - Add Dockerfile for production build (optional for take-home)
  - Configure environment variables for local development
  - **Status**: Complete - Docker setup with PostgreSQL configured and tested.

- [x] **5. Database Schema Design**:
  - Design Prisma schema for earthquake data and import history
  - Add appropriate indexes for performance
  - Configure migration scripts
  - **Status**: Complete - Schema created with appropriate models and indexes.

### Definition of Done for Milestone 2:
- NX workspace with Next.js app is properly configured
- Database connection is established with Prisma
- Basic project structure follows the package-first approach outlined in our documentation
- Docker Compose can start the development environment

## [x] Milestone 3: Database Setup and Data Import

### Objective: Set up the PostgreSQL database, create the necessary tables, and import earthquake data.

- [x] **1. PostgreSQL Setup**:
  - Docker configuration for PostgreSQL
  - Configure database connection in `.env`
  - Set up Prisma to connect to PostgreSQL
  - **Status**: Complete - PostgreSQL database configured and running in Docker.

- [x] **2. Prisma Schema Implementation**:
  - Create models for `Earthquake` and `ImportHistory`
  - Add proper indexes for efficient querying (on `date`, `magnitude`, and `location`)
  - Generate Prisma client
  - **Status**: Complete - Prisma schema created with all required models and indexes.

- [x] **3. Migration Generation and Application**:
  - Generate initial migration files
  - Apply migrations to create database tables
  - Verify table structure
  - **Status**: Complete - Migration successfully applied, tables created with proper structure.

- [x] **4. Data Import Script**:
  - Develop a script to download the earthquake CSV
  - Parse and validate the data
  - Import the data into the database
  - Handle errors and malformed data gracefully
  - **Status**: Complete - Script created and successfully imported 5,304 records.

- [x] **5. Data Verification**:
  - Verify data integrity
  - Test database queries
  - Ensure all required fields are present
  - **Status**: Complete - Data verified and accessible through Prisma client.

### Definition of Done for Milestone 3:
- PostgreSQL database is properly set up and accessible
- Database schema is implemented with required tables and indexes
- Earthquake data is successfully imported from CSV
- Data is verified to be accurate and complete
- Import history is properly tracked

## [ ] Milestone 4: GraphQL API Implementation

### Objective: Implement the GraphQL API to expose the earthquake data.

- [ ] **1. GraphQL Schema Definition**:
  - Define types for `Earthquake` and `ImportHistory`
  - Create queries for fetching earthquakes with filtering and pagination
  - Implement mutations for CRUD operations
  - **Output**: Complete GraphQL schema with proper types, queries, and mutations

- [ ] **2. Apollo Server Integration**:
  - Set up Apollo Server in Next.js API routes
  - Configure proper error handling and logging
  - Implement GraphQL Playground for easy API testing
  - **Output**: Working Apollo Server with interactive documentation

- [ ] **3. Resolvers Implementation**:
  - Create resolvers for all queries and mutations
  - Implement efficient database access through Prisma
  - Add pagination, sorting, and filtering capabilities
  - **Output**: Complete set of resolvers for all GraphQL operations

- [ ] **4. DataLoader Integration**:
  - Implement DataLoader to address N+1 query problems
  - Optimize batch loading for related data
  - **Output**: Efficient data loading patterns for GraphQL resolvers

- [ ] **5. Input Validation**:
  - Use Zod schemas for validating GraphQL inputs
  - Implement proper error handling for validation failures
  - **Output**: Robust input validation for all GraphQL operations

- [ ] **6. Testing**:
  - Write unit tests for GraphQL resolvers
  - Implement integration tests for the API
  - Create test utilities for GraphQL testing
  - **Output**: Comprehensive test suite for the GraphQL API

### Definition of Done for Milestone 4:
- GraphQL schema is fully implemented with all required types, queries, and mutations
- Apollo Server is configured and accessible via Next.js API routes
- All resolvers are implemented and connected to the Prisma database layer
- Input validation is in place for all operations
- Pagination, filtering, and sorting work properly for query operations
- Test coverage is in place for all GraphQL functionality

## [ ] Milestone 5: Frontend Development

### Objective: Build a user-friendly Next.js frontend application to interact with the GraphQL API.

- [ ] **1. UI Library Setup**:
  - [ ] Use `shadcn/ui` for components: `pnpm dlx shadcn@latest init`.
  - [ ] Install necessary components (e.g., `pnpm dlx shadcn@latest add table button form`).
  - [ ] Add global styles and theme configuration.
  - [ ] Set up TailwindCSS for custom styling.

- [ ] **2. Apollo Client Setup**:
  - [ ] Install `@apollo/client` and configure it to connect to the GraphQL API (Next.js API route or separate backend).
  - [ ] Set up Apollo Client Provider wrapper.
  - [ ] Compare with React Query and SWR alternatives, documenting decision.

- [ ] **3. Queries and Mutations**:
  - [ ] Define GraphQL operations with Zod validation:
    - `useQuery` for fetching earthquakes.
    - `useMutation` for add/update/delete.
  - [ ] Implement proper loading and error states.

- [ ] **4. Pages and Components**:
  - [ ] Use `shadcn/ui` components for a clean UI.
  - [ ] List Page (`/earthquakes`): Display a paginated table with sorting (e.g., by magnitude, date) and inline edit/delete buttons.
  - [ ] Add Page (`/earthquakes/new`): Form to create a new earthquake.
  - [ ] Edit Page (`/earthquakes/[id]`): Form to update an existing earthquake.
  - [ ] Implement responsive design for mobile and desktop.

- [ ] **5. Error Handling and Notifications**:
  - [ ] Show toast notifications (e.g., via `shadcn/ui`) for success/errors.
  - [ ] Handle loading states and display appropriate messages.
  - [ ] Implement error boundaries for graceful failure handling.

- [ ] **6. State Management**:
  - [ ] Apollo Client's cache should suffice, but evaluate React Query integration if additional caching benefits are needed.
  - [ ] Document state management decisions.

- [ ] **7. Frontend Testing**:
  - [ ] Write Jest tests for components and pages.
  - [ ] Add React Testing Library tests for component behavior.
  - [ ] Implement accessibility testing with axe-core.

- [ ] **8. Performance Optimization:**
  - [ ] Implement server-side rendering strategy (SSR/SSG/ISR)
  - [ ] Add bundle analysis for frontend optimization
  - [ ] Configure caching headers for static assets
  - [ ] Optimize image loading and rendering

- [ ] **9. Accessibility Compliance:**
  - [ ] Implement WCAG guidelines
  - [ ] Ensure keyboard navigation support
  - [ ] Add proper ARIA attributes
  - [ ] Test with screen readers

### Definition of Done for Milestone 5:
- UI components are fully implemented with Shadcn UI and TailwindCSS
- Apollo Client is configured and connected to the GraphQL API
- All required pages (list, add, edit) are implemented and functional
- CRUD operations work correctly through the UI
- Error handling and success notifications are in place
- Responsive design works on different screen sizes
- Accessibility requirements are met
- Performance optimizations are implemented
- Test coverage is in place for UI components and pages

## [ ] Milestone 6: Documentation and Final Polish

### Objective: Ensure the application is well-documented, polished, and ready for submission.

- [ ] **1. README and Setup Instructions:**
  - [ ] Create comprehensive README.md with:
    - Project overview and features
    - Setup and installation instructions
    - Database migration and seed instructions
    - Development workflow
    - Testing information
    - API documentation links
    - Node.js version requirements
  - [ ] Add troubleshooting section for common issues

- [ ] **2. API Documentation:**
  - [ ] Set up Apollo Studio Explorer configuration
  - [ ] Generate schema documentation from GraphQL types
  - [ ] Document queries, mutations, and examples

- [ ] **3. Architecture Documentation:**
  - [ ] Create architecture diagram using Mermaid or PlantUML
  - [ ] Document system components and interactions
  - [ ] Include decision documentation for key architectural choices

- [ ] **4. Code Quality Assurance:**
  - [ ] Run final linting and type checking
  - [ ] Fix any remaining warnings or errors
  - [ ] Conduct code review for best practices compliance
  - [ ] Ensure consistent naming conventions

- [ ] **5. Finalization:**
  - [ ] Clean up development artifacts and unused code
  - [ ] Verify all features work as expected
  - [ ] Check for performance issues with larger datasets
  - [ ] Ensure Docker configuration works properly
  - [ ] Create a final release tag in the repository

### Definition of Done for Milestone 6:
- Documentation is comprehensive and clear
- Code is clean, consistent, and follows best practices
- All features meet requirements and work as expected
- Project is ready for submission and evaluation
