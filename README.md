# Earthquake Management Application

A modern application for visualizing and managing earthquake data, built with Next.js, GraphQL, Prisma, and PostgreSQL.

## Project Overview

This application enables users to browse, search, and filter earthquake data through an intuitive interface. It demonstrates modern web development practices with a focus on performance, usability, and maintainability.

### Features

- Interactive map visualization of earthquake locations
- Filtering by magnitude, date range, and location
- Responsive design for desktop and mobile devices
- GraphQL API for efficient data retrieval
- CSV data import functionality

## Tech Stack

- **Frontend**: Next.js with App Router, React, Tailwind CSS, Shadcn UI
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest for unit tests, Playwright for E2E tests
- **Infrastructure**: Docker for local development
- **Tooling**: TypeScript, ESLint, Prettier
- **Architecture**: NX monorepo with package-first approach

## Project Structure

This project follows a package-first approach in an NX monorepo for better organization and code reuse:

```
earthquake-app/
├── apps/
│   ├── frontend/             # Next.js application
│   └── frontend-e2e/         # Playwright E2E tests
├── packages/
│   ├── db/                   # Prisma schema and database utilities
│   ├── graphql/              # GraphQL schema and resolvers
│   ├── ui/                   # Shadcn UI components
│   ├── types/                # Shared TypeScript types
│   └── utils/                # Shared utilities and helpers
├── docs/                     # Project documentation
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+
- Docker and Docker Compose

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd earthquake-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the database:
   ```bash
   docker-compose up -d
   ```

4. Apply database migrations:
   ```bash
   pnpm nx run db:migrate
   ```

5. Start the development server:
   ```bash
   pnpm nx dev frontend
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Workflow

### Running Commands

This project uses NX and pnpm for running tasks:

```bash
# Start Next.js development server
pnpm nx dev frontend

# Build the frontend for production
pnpm nx build frontend

# Run unit tests
pnpm nx test frontend

# Run E2E tests
pnpm nx e2e frontend-e2e
```

### Working with Packages

Each package can be developed and tested independently:

```bash
# Run tests for the GraphQL package
pnpm nx test graphql

# Generate Prisma client
pnpm nx prisma-generate db
```

### Adding UI Components

When adding Shadcn UI components, use the CLI:

```bash
pnpm dlx shadcn@latest add button
```

## Documentation

Additional documentation can be found in the `/docs` directory:

- [Development Plan](./development-plan.md)
- [Requirements](./requirements.md)
- [GraphQL Performance Considerations](./docs/graphql-performance-considerations.md)
- [Migration Guide](./docs/nextjs-to-express-migration.md)

## Contributing

1. Follow the package-first approach, placing shared code in appropriate packages
2. Ensure code passes ESLint and Prettier checks
3. Write tests for new features
4. Update documentation as needed

## License

This project is for demonstration purposes only.

---

*Note: This project was created as a take-home assignment with a focus on demonstrating core development skills and architecture decisions.*
