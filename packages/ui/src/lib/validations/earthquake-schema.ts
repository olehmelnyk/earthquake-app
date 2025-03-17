import * as z from 'zod';

/**
 * Schema for validating earthquake data
 */
export const earthquakeSchema = z.object({
  location: z.string()
    .min(1, "Location is required")
    .max(100, "Location must be less than 100 characters"),
  magnitude: z.coerce.number()
    .min(0.1, "Magnitude must be at least 0.1")
    .max(10, "Magnitude must be at most 10"),
  date: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  id: z.string().optional(),
});

export type EarthquakeFormValues = z.infer<typeof earthquakeSchema>;
