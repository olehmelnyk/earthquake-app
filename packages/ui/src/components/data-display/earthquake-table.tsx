import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "../../lib/utils";

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
  // Determine magnitude color based on severity
  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7.0) return "text-red-600 font-bold";
    if (magnitude >= 5.0) return "text-orange-500 font-bold";
    if (magnitude >= 3.0) return "text-yellow-500";
    return "text-green-500";
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
              <TableCell colSpan={4} className="h-24 text-center">
                Loading earthquake data...
              </TableCell>
            </TableRow>
          ) : earthquakes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No earthquake data found.
              </TableCell>
            </TableRow>
          ) : (
            earthquakes.map((earthquake) => (
              <TableRow
                key={earthquake.id}
                onClick={() => onRowClick?.(earthquake)}
                className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
              >
                <TableCell className="font-medium">{earthquake.location}</TableCell>
                <TableCell className={getMagnitudeColor(earthquake.magnitude)}>
                  {earthquake.magnitude.toFixed(1)}
                </TableCell>
                <TableCell>{new Date(earthquake.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
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
