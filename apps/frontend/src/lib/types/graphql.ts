/**
 * GraphQL type definitions for use in the frontend
 */

export enum SortField {
  LOCATION = 'location',
  MAGNITUDE = 'magnitude',
  DATE = 'date',
  CREATED_AT = 'createdAt',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface MagnitudeRange {
  min: number;
  max: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FilterOptions {
  locations: string[];
  magnitudeRange: MagnitudeRange;
  dateRange: DateRange;
}
