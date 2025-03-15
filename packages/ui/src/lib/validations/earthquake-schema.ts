import * as z from 'zod';

/**
 * Schema for validating earthquake data
 */
export const earthquakeSchema = z.object({
  location: z.string()
    .min(1, "Location is required")
    .max(100, "Location must be less than 100 characters")
    .refine(
      (val) => {
        // Check if location is in format "latitude, longitude" with both being valid decimal numbers
        const parts = val.split(',').map(part => part.trim());
        
        if (parts.length !== 2) return false;
        
        const [lat, lng] = parts;
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        
        // Validate latitude (-90 to 90) and longitude (-180 to 180)
        return !isNaN(latNum) && !isNaN(lngNum) && 
               latNum >= -90 && latNum <= 90 && 
               lngNum >= -180 && lngNum <= 180;
      },
      {
        message: "Location must be in format 'latitude, longitude' with valid coordinate values",
      }
    ),
  magnitude: z.coerce.number()
    .min(0, "Magnitude must be at least 0")
    .max(10, "Magnitude must be at most 10")
    .step(0.1, "Magnitude must be a multiple of 0.1"),
  date: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  id: z.string().optional(),
});

export type EarthquakeFormValues = z.infer<typeof earthquakeSchema>;
