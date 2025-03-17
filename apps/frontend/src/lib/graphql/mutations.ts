import { gql } from "@apollo/client";

export const CREATE_EARTHQUAKE_MUTATION = gql`
  mutation CreateEarthquake($input: EarthquakeInput!) {
    createEarthquake(input: $input) {
      id
      magnitude
      location
      date
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EARTHQUAKE_MUTATION = gql`
  mutation UpdateEarthquake($id: ID!, $input: EarthquakeUpdateInput!) {
    updateEarthquake(id: $id, input: $input) {
      id
      magnitude
      location
      date
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EARTHQUAKE_MUTATION = gql`
  mutation DeleteEarthquake($id: ID!) {
    deleteEarthquake(id: $id)
  }
`;

export interface CreateEarthquakeInput {
  location: string;
  magnitude: number;
  date: string;
}

export interface UpdateEarthquakeInput {
  location?: string;
  magnitude?: number;
  date?: string;
}
