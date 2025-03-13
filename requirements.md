# Test Assessment - TypeScript, Node.js, Next.js,
Apollo Server.

## Objective:
Create an API to manage a list of earthquakes using TypeScript/Node.js
(Express) and Apollo Server for the backend utilizing GraphQL and utilizing
any database (excluding file) on your preference to store the data.

## Requirements:
- Each earthquake is to be represented with the following fields:
  - id (unique)
  - location (string)
  - magnitude (number)
  - date (Date)
- Implement a GraphQL resolver to:
  - Fetch a list of earthquakes.
  - Add a new earthquake.
  - Update an existing earthquake.
  - Delete an earthquake.
- Set up initial data from a CSV file provided below

## Technical Details:
1. Backend:
  - Setup an Express + Apollo Server v4 application
  - Establish database connection
  - Setup GraphQL schema for the API
  - Define an Earthquake entity with the fields: id, location, magnitude, and date.
  - Set up migrations to create and manage the Earthquake table.
  - Implement a GraphQL schema and resolvers for CRUD operations on the Earthquake entity.
  - Make sure that the application validates data properly and provides
    error messages if the data is invalid or any query/mutations fail

2. Frontend:
- Create a TypeScript/Next.js application to handle CRUD operations with earthquakes data
- Use Apollo Client to set up GraphQL queries and mutations.
- Create components to display, add, update, and delete earthquakes.
- Make sure that the application validates data properly and provides error messages if the data is invalid or any query/mutation has failed.
- Make sure that the UI is clean and user-friendly. You can use any UI
library of your preference (MaterialUI, Antd, Tailwind, Bootstrap, etc.)

## Submission:
1. Provide a link to a public GitHub repository containing the source
code combined in the monorepo managed by NX or pnpm.
2. Include detailed instructions on how to run the application locally in the README file, including database migration instructions, data seed instructions, and the proper version of environments/runtimes that the application is being run in, for example Node.js version.
3. Ensure the application is well-documented and follows best practices for code quality and structure, including configuration of eslint, Prettier, etc.
4. If you use any standalone database like Postgres or MySQL that requires installation, make sure you provide a proper docker configuration for that (Dockerfile or docker compose configuration).

CSV example: https://data.humdata.org/dataset/catalog-of-earthquakes1970-2014/resource/10ac8776-5141-494b-b3cd-bf7764b2f964
