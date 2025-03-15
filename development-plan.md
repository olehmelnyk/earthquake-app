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
- **Note for Take-Home Assignment:** We acknowledge this potential problem but won't implement DataLoader in this assignment to focus on core requirements. In a production environment, this would be addressed to ensure optimal performance.

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

## [x]  Milestone 1: Requirements Gathering, Investigation, and Development Planning

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

- [x] **3. GraphQL Considerations**:
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

- [x] **6. Caching with Redis**:
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
    - [ ] Plan for structured logging with Winston or Pino
    - [ ] Set up error monitoring with Sentry or similar for production
    - [ ] Add health check endpoints
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

## [x] Milestone 3: Database and GraphQL API Setup

### Objective: Implement the database schema and GraphQL API for the project.

- [x] **1. Prisma Schema Definition**:
  - [x] Define Prisma schema for earthquake data with:
    - `id`: String (UUID)
    - `location`: String (formatted as "City, Country" or coordinates)
    - `magnitude`: Float
    - `date`: DateTime
    - Additional metadata fields (e.g., createdAt, updatedAt)
  - [x] Configure relations for any associated data (e.g., importHistory)
  - [x] Set up necessary indexes for performance
  - [x] Add comprehensive documentation for the schema
  - **Output**: Complete Prisma schema in `packages/db/prisma/schema.prisma`

- [x] **2. Database Migrations**:
  - [x] Generate and apply initial migration
  - [x] Implement seed script to populate database with CSV data
  - [x] Create script for resetting development database if needed
  - **Output**: Database migration files and seed script

- [x] **3. GraphQL Schema Definition**:
  - [x] Define GraphQL types for:
    - Earthquake
    - EarthquakeFilterInput (for filtering by location, magnitude range, date range)
    - PaginationInput (for paginated lists)
    - OrderByInput (for sorting)
  - [x] Define queries for:
    - earthquake(id: ID!): Earthquake
    - earthquakes(filter: EarthquakeFilterInput, pagination: PaginationInput, orderBy: OrderByInput): EarthquakeConnection
    - filterOptions: FilterOptions (to get unique locations, magnitude range, etc.)
  - [x] Define mutations for:
    - createEarthquake(input: CreateEarthquakeInput!): Earthquake
    - updateEarthquake(id: ID!, input: UpdateEarthquakeInput!): Earthquake
    - deleteEarthquake(id: ID!): Boolean
    - importEarthquakes(url: String!): ImportResult
  - **Output**: GraphQL schema in `packages/graphql/schema.graphql`

- [x] **4. GraphQL Resolvers Implementation**:
  - [x] Implement query resolvers
  - [x] Implement mutation resolvers
  - [x] Add error handling and validation
  - [x] Integrate with Prisma client
  - **Output**: GraphQL resolvers in `packages/graphql/src/resolvers`

- [ ] **4. DataLoader Integration**:
  - **Note for Take-Home Assignment:** While DataLoader would be important in a production application, we're intentionally skipping this implementation for the take-home assignment to focus on core requirements. We acknowledge the N+1 problem but consider it acceptable for the demo purposes with the limited dataset size.
  - In a real-world implementation we would:
    - Implement DataLoader to address N+1 query problems
    - Optimize batch loading for related data
    - Add caching strategies for frequently accessed data
  - **Output**: This task is intentionally marked as not implemented in the take-home assignment.

### Definition of Done for Milestone 3:
- Database schema is properly designed and implemented
- GraphQL schema reflects all required operations
- Resolvers correctly implement all queries and mutations
- Data can be queried and modified through the GraphQL API
- Error handling and validation are in place

## [x] Milestone 4: Apollo Client Integration in Frontend

### Objective: Set up Apollo Client in the Next.js application to connect to the GraphQL API.

- [x] **1. Apollo Client Setup**:
  - [x] Install and configure Apollo Client in the Next.js app
  - [x] Set up proper caching strategies
  - [x] Create GraphQL code generation configuration
  - **Output**: Working Apollo Client configuration in the frontend

- [x] **2. GraphQL Operations Definition**:
  - [x] Define query operations for fetching earthquake data
  - [x] Create mutation operations for CRUD functionality
  - [x] Set up fragment reuse for common data patterns
  - **Output**: GraphQL operation definitions for the frontend

- [x] **3. Custom React Hooks**:
  - [x] Create custom hooks for data fetching (useEarthquakes, useEarthquake)
  - [x] Implement hooks for mutations (useCreateEarthquake, useUpdateEarthquake, useDeleteEarthquake)
  - [x] Add proper loading, error, and success states
  - **Output**: Reusable React hooks for GraphQL operations

- [x] **4. State Management**:
  - [x] Implement Apollo cache updates after mutations
  - [x] Set up optimistic UI updates for better user experience
  - [x] Create error handling and retry mechanisms
  - **Output**: Robust state management for GraphQL operations

### Definition of Done for Milestone 4:
- Apollo Client is properly configured in the Next.js app
- GraphQL operations are defined for all required functionality
- Custom hooks provide an easy-to-use interface for components
- State management handles loading, errors, and cache updates

## [ ] Milestone 5: UI Component Development

### Objective: Build reusable UI components for the earthquake management application.

- [ ] **1. Design System Configuration**:
  - [ ] Set up Shadcn UI components
  - [ ] Configure global styles and themes
  - [ ] Implement responsive design utilities
  - **Output**: Consistent design system for the application

- [ ] **2. Data Display Components**:
  - [ ] Create earthquake table component
  - [ ] Implement earthquake card component for alternative views
  - [ ] Build detail view component for showing earthquake information
  - **Output**: Components for displaying earthquake data

- [ ] **3. Form Components**:
  - [ ] Implement filter form with proper validation
  - [ ] Create earthquake add/edit form
  - [ ] Build form components for search and other interactions
  - **Output**: Form components for user interactions

- [ ] **4. Feedback Components**:
  - [ ] Create loading indicators and skeletons
  - [ ] Implement error messages and alerts
  - [ ] Add success notifications
  - **Output**: Components for user feedback

### Definition of Done for Milestone 5:
- Design system is consistently applied across the application
- Data display components render earthquake information effectively
- Form components handle user input with proper validation
- Feedback components provide clear indications of system state

## [ ] Milestone 6: Frontend Implementation

### Objective: Develop the user interface for the earthquake management application.

- [ ] **1. Layout and Navigation**:
  - [ ] Implement responsive layout with Shadcn UI
  - [ ] Create navigation sidebar/header
  - [ ] Add dark/light theme toggle
  - **Output**: Base layout components in `apps/frontend/components/layout`

- [ ] **2. Earthquake List View**:
  - [ ] Create basic table component with columns for id, location, magnitude, date
  - [ ] Implement sorting by clicking column headers
  - [ ] Add pagination controls
  - [ ] Style with Shadcn UI and Tailwind
  - **Output**: Earthquake list component in `apps/frontend/components/earthquakes`

- [ ] **3. Filtering Interface**:
  - [ ] Create filter panel with basic inputs
  - [ ] Implement proper UI components with Shadcn UI:
    - [ ] Location dropdown/autocomplete
    - [ ] Magnitude range slider
    - [ ] Date range picker
  - [x] Implement filter state management
  - [x] Connect filters to GraphQL queries
  - **Output**: Filter components in `apps/frontend/components/filters`

- [ ] **4. Earthquake Detail View**:
  - [ ] Create detail page or modal for viewing earthquake information
  - [ ] Implement edit functionality for earthquake data
  - [ ] Add delete confirmation dialog
  - **Output**: Detail view component for earthquake data

- [ ] **5. Dashboard and Analytics**:
  - [ ] Create simple dashboard with earthquake statistics
  - [ ] Implement basic visualization (e.g., chart of earthquakes by magnitude)
  - [ ] Add filters for the dashboard view
  - **Output**: Dashboard components for analytics

### Definition of Done for Milestone 6:
- All planned UI views are implemented and functional
- Users can browse, sort, filter, and view earthquake data
- Editing and deletion of earthquake records works properly
- UI provides a consistent and intuitive user experience

## [ ] Milestone 7: Testing and Quality Assurance

### Objective: Ensure the application meets quality standards through comprehensive testing.

- [ ] **1. Unit Testing**:
  - [ ] Write tests for GraphQL resolvers
  - [ ] Test UI components in isolation
  - [ ] Create tests for utility functions
  - **Output**: Comprehensive unit test suite

- [ ] **2. Integration Testing**:
  - [ ] Test GraphQL queries and mutations
  - [ ] Verify database operations work correctly
  - [ ] Test frontend-backend integration
  - **Output**: Integration tests for key system interactions

- [ ] **3. End-to-End Testing**:
  - [ ] Create E2E tests for critical user flows
  - [ ] Verify application works in different browsers
  - [ ] Test responsive behavior
  - **Output**: E2E test suite with Playwright

- [ ] **4. Accessibility Testing**:
  - [ ] Verify WCAG compliance
  - [ ] Test keyboard navigation
  - [ ] Ensure proper ARIA attributes
  - **Output**: Accessibility test reports

### Definition of Done for Milestone 7:
- Unit tests cover critical functionality
- Integration tests verify system components work together
- E2E tests confirm user flows function correctly
- Application meets basic accessibility standards

## [ ] Milestone 8: Documentation and Deployment

### Objective: Create comprehensive documentation and prepare the application for deployment.

- [ ] **1. User Documentation**:
  - [ ] Create user guide for the application
  - [ ] Document features and functionality
  - [ ] Add screenshots and examples
  - **Output**: User documentation in the repository

- [ ] **2. Developer Documentation**:
  - [ ] Document architecture and design decisions
  - [ ] Create API documentation
  - [ ] Add setup and contribution guidelines
  - **Output**: Developer documentation in the repository

- [ ] **3. Deployment Configuration**:
  - [ ] Set up Docker Compose for production
  - [ ] Configure environment variables
  - [ ] Create deployment scripts
  - **Output**: Deployment configuration files

- [ ] **4. Final Review**:
  - [ ] Conduct code review
  - [ ] Address any remaining issues
  - [ ] Prepare for submission
  - **Output**: Final version ready for submission

### Definition of Done for Milestone 8:
- Documentation is comprehensive and clear
- Deployment configuration works reliably
- Code is clean and follows best practices
- Project is ready for submission
