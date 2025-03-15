import { gql } from 'graphql-tag';

// Define the GraphQL schema using SDL (Schema Definition Language)
export const typeDefs = gql`
  # Custom scalar for Date types
  scalar Date

  # Earthquake type representing earthquake data
  type Earthquake {
    id: ID!
    location: String!
    magnitude: Float!
    date: Date!
    createdAt: Date!
    updatedAt: Date!
  }

  # ImportHistory type for tracking CSV imports
  type ImportHistory {
    id: ID!
    filename: String!
    recordCount: Int!
    status: String!
    startedAt: Date!
    completedAt: Date
    error: String
    createdAt: Date!
    updatedAt: Date!
  }

  # Input type for creating a new earthquake
  input EarthquakeInput {
    location: String!
    magnitude: Float!
    date: Date!
  }

  # Input type for updating an existing earthquake
  input EarthquakeUpdateInput {
    location: String
    magnitude: Float
    date: Date
  }

  # Input type for magnitude filter
  input MagnitudeFilterInput {
    min: Float
    max: Float
  }

  # Input type for date filter
  input DateFilterInput {
    start: Date
    end: Date
  }

  # Input type for filtering earthquakes
  input EarthquakeFilterInput {
    location: String
    magnitude: MagnitudeFilterInput
    date: DateFilterInput
  }

  # Input type for pagination
  input PaginationInput {
    skip: Int
    take: Int
  }

  # Enum for sort fields
  enum SortField {
    location
    magnitude
    date
    createdAt
  }

  # Enum for sort directions
  enum SortDirection {
    asc
    desc
  }

  # Input type for ordering results
  input OrderByInput {
    field: SortField!
    direction: SortDirection!
  }

  # Filter options for the earthquake list
  type FilterOptions {
    locations: [String!]!
    magnitudeRange: MagnitudeRange!
    dateRange: DateRange!
  }

  # Magnitude range for filter options
  type MagnitudeRange {
    min: Float!
    max: Float!
  }

  # Date range for filter options
  type DateRange {
    earliest: Date!
    latest: Date!
  }

  # Pagination metadata
  type PageInfo {
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # Paginated earthquake response
  type EarthquakeConnection {
    edges: [Earthquake!]!
    pageInfo: PageInfo!
  }

  # Queries
  type Query {
    # Get a single earthquake by ID
    earthquake(id: ID!): Earthquake

    # Get a list of earthquakes with filtering, pagination, and sorting
    earthquakes(
      filter: EarthquakeFilterInput
      pagination: PaginationInput
      orderBy: OrderByInput
    ): EarthquakeConnection!

    # Get filter options for the earthquake list
    filterOptions: FilterOptions!

    # Get import history entries
    importHistory: [ImportHistory!]!
  }

  # Mutations
  type Mutation {
    # Create a new earthquake
    createEarthquake(input: EarthquakeInput!): Earthquake!

    # Update an existing earthquake
    updateEarthquake(id: ID!, input: EarthquakeUpdateInput!): Earthquake!

    # Delete an earthquake
    deleteEarthquake(id: ID!): Boolean!

    # Batch delete earthquakes
    batchDeleteEarthquakes(ids: [ID!]!): Int!
  }
`;
