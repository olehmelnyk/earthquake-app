"use client"

import { ColumnDef } from "@tanstack/react-table"

// Match the Earthquake interface from the frontend
export interface EarthquakeTableData {
  id: string
  magnitude: number
  location: string
  time: string
  date?: string
}

// Helper function to format coordinates
const formatCoordinates = (location: string): string => {
  // Check if location is in coordinate format (contains comma)
  if (location && location.includes(',')) {
    try {
      const [lat, long] = location.split(',').map(coord => parseFloat(coord.trim()));
      return `${lat.toFixed(2)}, ${long.toFixed(2)}`;
    } catch (e) {
      return location;
    }
  }
  return location;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

export const earthquakeColumns: ColumnDef<EarthquakeTableData>[] = [
  {
    accessorKey: "magnitude",
    header: "Magnitude",
    cell: ({ row }) => {
      const magnitude = parseFloat(row.getValue("magnitude"));
      
      // Add color based on magnitude
      let colorClass = "text-green-600";
      if (magnitude >= 7) {
        colorClass = "text-red-600 font-bold";
      } else if (magnitude >= 5) {
        colorClass = "text-orange-500 font-semibold";
      } else if (magnitude >= 3) {
        colorClass = "text-yellow-600";
      }
      
      return <div className={`font-medium ${colorClass}`}>{magnitude.toFixed(1)}</div>;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      // Use location from the row data
      const location = row.getValue("location") as string || row.original.location || "Unknown";
      
      // Format coordinates if it's a coordinate string
      const formattedLocation = formatCoordinates(location);
      
      return <div className="max-w-[200px] truncate" title={location}>{formattedLocation}</div>;
    },
  },
  {
    accessorKey: "time",
    header: "Date & Time",
    cell: ({ row }) => {
      // Use time or date depending on what's available
      const time = row.getValue("time") as string;
      const date = row.original.date;
      
      if (time) {
        return <div>{formatDate(time)}</div>;
      }
      
      return <div>{date ? formatDate(date) : "Unknown"}</div>;
    },
  },
]
