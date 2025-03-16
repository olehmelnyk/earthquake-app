import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';

export interface EarthquakeData {
  id: string;
  location: string;
  magnitude: number;
  date: string;
}

export interface EarthquakeTableProps extends React.HTMLAttributes<HTMLDivElement> {
  earthquakes: EarthquakeData[];
  onRowClick?: (earthquake: EarthquakeData) => void;
  isLoading?: boolean;
}

/**
 * EarthquakeTable component for displaying a list of earthquakes
 * Displays ID, location, magnitude, and date of earthquakes in a table format
 */
export function EarthquakeTable({
  className,
  earthquakes,
  onRowClick,
  isLoading = false,
  ...props
}: EarthquakeTableProps) {
  // Determine magnitude class based on severity
  const getMagnitudeClass = (magnitude: number) => {
    if (magnitude >= 7.0) return "text-red-600 font-bold";
    if (magnitude >= 5.0) return "text-orange-500 font-bold";
    if (magnitude >= 3.0) return "text-yellow-600 font-bold";
    return "text-green-600 font-bold";
  };

  return (
    <div className={cn("w-full overflow-auto", className)} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Magnitude</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-gray-500 dark:text-gray-400">
                Loading earthquake data...
              </TableCell>
            </TableRow>
          ) : earthquakes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-gray-500 dark:text-gray-400">
                No earthquake data found.
              </TableCell>
            </TableRow>
          ) : (
            earthquakes.map((earthquake) => (
              <TableRow
                key={earthquake.id}
                onClick={() => onRowClick?.(earthquake)}
                className={onRowClick ? "cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-800/50" : ""}
              >
                <TableCell className="font-medium">{earthquake.location}</TableCell>
                <TableCell>
                  <span className={getMagnitudeClass(earthquake.magnitude)}>
                    {earthquake.magnitude.toFixed(1)}
                  </span>
                </TableCell>
                <TableCell>{formatDate(earthquake.date)}</TableCell>
                <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                  {earthquake.id}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
