# Development Plan

## [ ]  Milestone 1: Requirements Gathering, Investigation, and Development Planning

### Objective: Clarify requirements, investigate architectural options, and plan the development process.

- [ ] **1. Backend Architecture Decision**:

  - The task specifies using Express with Apollo Server for the backend, but since Next.js is required for the frontend, explore integrating the GraphQL API into Next.js using its API routes. This avoids managing two separate servers, simplifying deployment and development.
  - **Investigation**: Research the feasibility, pros (e.g., unified codebase, easier local development), and cons (e.g., potential scalability limitations for complex backends) of hosting the backend within Next.js.
  - **Output**: Document findings in `architecture/use-nextjs-for-backend.md`.

- [x] **2. Database Selection**:

  - Choose PostgreSQL as the database due to its robustness, support for complex queries, and compatibility with Prisma (an ORM that streamlines database interactions).
  - Reasoning: It meets the requirement of a non-file-based database and is widely adopted, making it a practical choice.

- [ ] **3. CSV Data Handling**:
  - The CSV file contains 5,304 entries, which is substantial. Loading it entirely into memory could strain resources, so consider streaming or chunk-based processing.
  - **Plan**: Develop a script to download the CSV from the provided URL (https://data.humdata.org/dataset/4881d82b-ba63-4515-b748-c364f3d05b42/resource/10ac8776-5141-494b-b3cd-bf7764b2f964/download/earthquakes1970-2014.csv) and create a database seed or migration to populate the `Earthquake` table. Use a library like `csv-parse` with streaming capabilities.
  - **Fields to Map**: Based on the CSV schema example, extract `DateTime` (as date), `Latitude`/`Longitude` (combine into `location` string), and `Magnitude`. Ignore unused fields like `Depth`, `MagType`, etc., unless specified.
  - **Output**: Document the script in `data/earthquakes1970-2014.csv` and the database seed or migration in `prisma/migrations/`. Generate a csv-handler-development-plan.md file with the plan for csv data handling.

- [ ] **4. GraphQL Considerations**:
  - **N+1 Query Problem**: In GraphQL, nested resolvers can lead to multiple database queries. Investigate solutions like DataLoader to batch requests or optimize queries with joins via Prisma.
  - **Output**: Note findings and chosen approach in the backend documentation.

- [ ] **5. Prisma Generators:**
  - Enhance development with Prisma generators:
    - TypeScript Types: Use `prisma-generator-typescript-interfaces` for type safety.
    - Documentation: Use `prisma-docs-generator` for schema documentation.
    - Zod Validations: Use `prisma-zod-generator` to generate Zod schemas for input validation.
    - GraphQL Schema: Apollo Server can leverage Prisma directly, so a separate CRUD generator may not be needed.
    - **Investigation**: Assess which generators align with the project’s needs and avoid overcomplicating the setup.
    - **Output**: Document findings in `prisma/generators.md`.

- [x] **6. Caching with Redis**:
  - **Evaluation**: Redis could cache frequent read operations (e.g., earthquake list queries), but for a CRUD app with 5,304 records, PostgreSQL’s indexing and query optimization might suffice.
  - **Decision**: Likely overkill unless performance tests show significant bottlenecks. Document pros (e.g., faster reads) and cons (e.g., added complexity) in `architecture/redis-usage.md`.

- [ ] **7. Additional Considerations**:
  - **Data Validation**: Validate CSV data and user inputs (e.g., magnitude as a positive number, valid date formats).
  - **Error Handling**: Return meaningful GraphQL errors (e.g., ValidationError, NotFoundError).
  - **Performance**: Plan for pagination and filtering in the earthquake list to handle the dataset efficiently.
  - **Output**: Document findings in `architecture/additional-considerations.md`.

## [ ] Milestone 2: Project Initialization

### Objective: Set up the initial project structure, tools, environment, including backend, frontend, and database configuration.

- [ ] **1. Version Control:**
  - [ ] Initialize a public GitHub repository for the project.
  - [ ] Set up Git hooks for pre-commit and pre-push.
  - [ ] Configure Git to use the repository.

- [ ] **2. Monorepo Setup:**
  - [ ] Use NX to create a monorepo, managing both frontend (Next.js) and backend (Express, if separate).
  - Commands:
    - [ ] `npx create-nx-workspace@latest earthquake-app --preset=apps`
    - [ ] Add Next.js: `nx g @nx/next:app frontend`
    - [ ] Add Express (if separate): `nx g @nx/express:init backend`
  - Use `pnpm` as the package manager for efficiency.

- [ ] **3. Docker Configuration:**
  - Set up PostgreSQL in Docker:
    - `Dockerfile`: Define a basic Postgres image with custom configs (if needed).
    - `docker-compose.yml`: Include Postgres service with persistent volume and environment variables (e.g., `POSTGRES_USER`, `POSTGRES_PASSWORD`).
  - Ensure the database is accessible from the app.

- [x] **4. Instruction Files:**
  - Create `.cursorrules` with AI instructions for best practices (e.g., TypeScript strict mode, ESLint rules, Prettier formatting).
  - Symlink it to `.windsurfrules` for consistency: `ln -s .cursorrules .windsurfrules`.

## [ ] Milestone 3: Backend Development

### Objective: Build the GraphQL API and database integration.

- [ ] **1. Database Setup:**
  - Initialize Prisma: `npx prisma init`.
  - Connect to PostgreSQL in Docker via `DATABASE_URL` in `.env`.
  - Define the `Earthquake` model in `prisma/schema.prisma`:

```prisma
  id        String   @id @default(uuid())
  location  String
  magnitude Float
  date      DateTime
```

- [ ] **2. Prisma Generators:**
  - Add to `prisma/schema.prisma`:
```prisma
  generator ts {
    provider = "prisma-generator-typescript-interfaces"
  }

  generator docs {
    provider = "prisma-docs-generator"
  }

  generator zod {
    provider = "prisma-zod-generator"
  }
```

- [ ] **3. CSV Data Import:**
  - Write a script (e.g., `scripts/import-csv.ts`) to:
    - Download the CSV using `fetch`.
    - Parse it with `csv-parse` in stream mode.
    - Insert data into the database via Prisma in chunks (e.g., 500 records at a time).
    - Create a Prisma seed: `npx prisma db seed`.

- [ ] **4. GraphQL Schema and Resolvers:**
  - [ ] Define the schema (e.g., schema.graphql):
```graphql
type Earthquake {
  id: ID!
  location: String!
  magnitude: Float!
  date: String!
}

type Query {
  earthquakes(offset: Int, limit: Int, location: String, minMagnitude: Float): [Earthquake!]!
}

type Mutation {
  addEarthquake(location: String!, magnitude: Float!, date: String!): Earthquake!
  updateEarthquake(id: ID!, location: String, magnitude: Float, date: String): Earthquake!
  deleteEarthquake(id: ID!): Boolean!
}
```

- [ ] Implement resolvers with Prisma and Apollo Server, using DataLoader for N+1 mitigation.


- [ ] **5. Pagination and Filtering:**
  - Add `offset` and `limit` for pagination, and filters like `location` and `minMagnitude`.
  - Optimize with Prisma’s `skip`, `take`, and `where` clauses.

- [ ] **6. Error Handling and Validation:**
  - [ ] Use Zod schemas (generated by `prisma-zod-generator`) for input validation.
  - [ ] Return GraphQL errors with descriptive messages.

- [ ] **7. Testing:**
  - [ ] Write Jest tests for resolvers and CSV import script (unit and integration).

## [ ] **Milestone 4: Frontend Development**

### Objective: Build a user-friendly Next.js frontend application to interact with the GraphQL API.

- [ ] **1. UI Library**:
  - Use `shadcn/ui` for components: `pnpm dlx shadcn@latest init`.
  - Install necessary components (e.g., `pnpm dlx shadcn@latest add table button form`).

- [ ] **2. Apollo Client Setup**:
  - Install `@apollo/client` and configure it to connect to the GraphQL API (Next.js API route or separate backend).

- [ ] **3. Queries and Mutations**:
  - Define GraphQL operations with Zod validation:
    - `useQuery` for fetching earthquakes.
    - `useMutation` for add/update/delete.

- [ ] **4. Pages and Components**:
  - Use `shadcn/ui` components for a clean UI.
  - [ ] List Page (`/earthquakes`): Display a paginated table with sorting (e.g., by magnitude, date) and inline edit/delete buttons.
  - [ ] Add Page (`/earthquakes/new`): Form to create a new earthquake.
  - [ ] Edit Page (`/earthquakes/[id]`): Form to update an existing earthquake.

- [ ] **5. Error Handling and Notifications**:
  - [ ] Show toast notifications (e.g., via `shadcn/ui`) for success/errors.
  - [ ] Handle loading states and display appropriate messages.

- [ ] **6. State Management**:
  - [ ] Apollo Client’s cache should suffice, but evaluate React Query integration if additional caching benefits are needed.

- [ ] **7. Testing**:
  - [ ] Write Jest tests for components and pages.

-----

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

-----

## Additional Notes
- Redis: Skip unless performance issues arise, as PostgreSQL should handle this scale.
- README: Include setup instructions (e.g., `pnpm install`, `docker-compose up`, `npx prisma migrate dev`, `pnpm run dev`), Node.js version (e.g., 22.x), and architecture decisions.
- Best Practices: Use TypeScript strict mode, linting, and consistent formatting.