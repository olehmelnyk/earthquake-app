import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";

export interface EarthquakeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  location: string;
  magnitude: number;
  date: string;
  id?: string;
  footer?: React.ReactNode;
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
  footer,
  ...props
}: EarthquakeCardProps) {
  // Format the earthquake date
  const formattedDate = new Date(date).toLocaleString();

  // Determine magnitude color based on severity
  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7.0) return "text-red-600 font-bold";
    if (magnitude >= 5.0) return "text-orange-500 font-bold";
    if (magnitude >= 3.0) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-lg">{location}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Magnitude:</span>
          <span className={getMagnitudeColor(magnitude)}>{magnitude.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Date:</span>
          <span className="text-sm">{formattedDate}</span>
        </div>
        {id && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ID:</span>
            <span className="text-sm text-muted-foreground truncate max-w-[150px]">{id}</span>
          </div>
        )}
      </CardContent>
      {footer && (
        <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
