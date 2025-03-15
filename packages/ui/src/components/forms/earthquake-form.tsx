import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EarthquakeFormValues, earthquakeSchema } from '../../lib/validations/earthquake-schema';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import { cn } from '../../lib/utils';

export interface EarthquakeFormProps extends React.HTMLAttributes<HTMLFormElement> {
  defaultValues?: Partial<EarthquakeFormValues>;
  onFormSubmit: (data: EarthquakeFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

/**
 * EarthquakeForm component for creating and editing earthquake data
 * Includes validation for location, magnitude, and date fields
 */
export function EarthquakeForm({
  className,
  defaultValues,
  onFormSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
  ...props
}: EarthquakeFormProps) {
  const form = useForm<EarthquakeFormValues>({
    resolver: zodResolver(earthquakeSchema),
    defaultValues: {
      location: '',
      magnitude: 0,
      date: new Date().toISOString().split('T')[0],
      ...defaultValues,
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = handleSubmit(onFormSubmit);

  return (
    <form className={cn('space-y-6', className)} onSubmit={onSubmit} {...props}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location (Coordinates)</Label>
          <Input
            id="location"
            {...register('location')}
            placeholder="latitude, longitude (e.g., 34.05, -118.25)"
          />
          {errors.location && (
            <Alert variant="destructive" className="mt-1 p-2 text-sm">
              {errors.location.message}
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="magnitude">Magnitude</Label>
          <Input
            id="magnitude"
            type="number"
            step="0.1"
            min="0"
            max="10"
            {...register('magnitude')}
          />
          {errors.magnitude && (
            <Alert variant="destructive" className="mt-1 p-2 text-sm">
              {errors.magnitude.message}
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="datetime-local"
            {...register('date')}
          />
          {errors.date && (
            <Alert variant="destructive" className="mt-1 p-2 text-sm">
              {errors.date.message}
            </Alert>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
