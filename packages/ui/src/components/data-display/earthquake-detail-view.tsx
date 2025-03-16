import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";

export interface EarthquakeDetailViewProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  location: string;
  magnitude: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  children?: React.ReactNode;
}

/**
 * EarthquakeDetailView component for displaying detailed earthquake information
 * Shows comprehensive information about a single earthquake
 */
export function EarthquakeDetailView({
  className,
  id,
  location,
  magnitude,
  date,
  createdAt,
  updatedAt,
  children,
  ...props
}: EarthquakeDetailViewProps) {
  // Determine magnitude color based on severity
  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7.0) return "text-red-600 font-bold";
    if (magnitude >= 5.0) return "text-orange-500 font-bold";
    if (magnitude >= 3.0) return "text-yellow-600 font-bold";
    return "text-green-600 font-bold";
  };

  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{location}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Magnitude:</span>
              <span className={getMagnitudeColor(magnitude)}>{magnitude.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Date:</span>
              <span>{formatDate(date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">ID:</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[220px]">{id}</span>
            </div>
          </div>

          <div className="space-y-2">
            {createdAt && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Created:</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(createdAt)}</span>
              </div>
            )}
            {updatedAt && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Last Updated:</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {children}
      </CardContent>
    </Card>
  );
}
