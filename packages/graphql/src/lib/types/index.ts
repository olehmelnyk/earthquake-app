import { z } from 'zod';

// Base types that will be used across the GraphQL schema
export const DateScalar = z.date();
export type DateScalar = Date;

// Input validation schemas
export const EarthquakeInputSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  magnitude: z.number().min(0, 'Magnitude must be a positive number'),
  date: z.date(),
});

export type EarthquakeInput = z.infer<typeof EarthquakeInputSchema>;

export const EarthquakeUpdateInputSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  location: z.string().min(1, 'Location is required').optional(),
  magnitude: z.number().min(0, 'Magnitude must be a positive number').optional(),
  date: z.date().optional(),
});

export type EarthquakeUpdateInput = z.infer<typeof EarthquakeUpdateInputSchema>;

export const EarthquakeFilterInputSchema = z.object({
  location: z.string().optional(),
  magnitude: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  date: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
});

export type EarthquakeFilterInput = z.infer<typeof EarthquakeFilterInputSchema>;

export const PaginationInputSchema = z.object({
  skip: z.number().int().min(0).default(0),
  take: z.number().int().min(1).max(100).default(10),
});

export type PaginationInput = z.infer<typeof PaginationInputSchema>;

export const OrderByInputSchema = z.object({
  field: z.enum(['location', 'magnitude', 'date', 'createdAt']),
  direction: z.enum(['asc', 'desc']),
});

export type OrderByInput = z.infer<typeof OrderByInputSchema>;
