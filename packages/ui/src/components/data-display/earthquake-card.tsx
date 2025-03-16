import React from 'react';
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export interface EarthquakeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  location: string;
  magnitude: number;
  date: string;
  id?: string;
}

/**
 * EarthquakeCard component for displaying earthquake information
 * Displays location, magnitude, and date of an earthquake in a card format
 */
export function EarthquakeCard({
  className,
  location,
  magnitude,
  date,
  id,
  ...props
}: EarthquakeCardProps) {
  // Format the earthquake date
  const formattedDate = new Date(date).toLocaleString();

  // Determine magnitude color based on severity
  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7.0) return "text-red-600 font-bold";
    if (magnitude >= 5.0) return "text-orange-500 font-bold";
    if (magnitude >= 3.0) return "text-yellow-600 font-bold";
    return "text-green-600 font-bold";
  };

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-lg">{location}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Magnitude:</span>
          <span className={getMagnitudeColor(magnitude)}>{magnitude.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Date:</span>
          <span className="text-sm">{formattedDate}</span>
        </div>
        {id && (
          <div className="flex justify-between items-center text-xs mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">ID:</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{id}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
