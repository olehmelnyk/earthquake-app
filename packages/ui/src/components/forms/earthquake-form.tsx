"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

export const formSchema = z.object({
  magnitude: z.coerce.number().min(0, {
    message: "Magnitude must be at least 0.1",
  }).max(10, {
    message: "Magnitude must be at most 10",
  }),
  location: z.string().min(1, {
    message: "Location is required",
  }),
  date: z.string().refine((val) => {
    try {
      return !isNaN(new Date(val).getTime());
    } catch {
      return false;
    }
  }, {
    message: "Please enter a valid date",
  }),
})

export type EarthquakeFormValues = z.infer<typeof formSchema>;

export interface EarthquakeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EarthquakeFormValues) => void;
  initialValues?: EarthquakeFormValues;
}

export function EarthquakeForm({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: EarthquakeFormProps) {
  const defaultValues = {
    magnitude: 5,
    location: "",
    date: new Date().toISOString(),
  };
  const form = useForm<EarthquakeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || defaultValues,
  });

  // Reset form when initialValues change or when dialog opens/closes
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    } else if (!open) {
      // Reset form when dialog closes and there are no initial values
      form.reset(defaultValues);
    }
  }, [form, initialValues, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValues ? "Edit" : "Add"} Earthquake</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="magnitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Magnitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      placeholder="Enter magnitude (e.g., 3.5)"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter location (e.g., 37.7749, -122.4194)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          try {
                            const date = new Date(e.target.value);
                            if (!isNaN(date.getTime())) {
                              field.onChange(date.toISOString());
                            }
                          } catch (error) {
                            console.error("Invalid date format:", error);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {initialValues ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
