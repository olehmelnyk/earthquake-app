"use client"

import { ColumnDef } from "@tanstack/react-table"

// Match the Earthquake interface from the frontend
export interface EarthquakeTableData {
  id: string
  magnitude: number
  location: string
  date: string
  actions?: {
    onEdit?: () => void
    onDelete?: () => void
  }
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
    accessorKey: "date",
    header: "Date & Time",
    cell: ({ row }) => {
      // Use date from the row data
      const date = row.getValue("date") as string || row.original.date || "Unknown";
      
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const actions = row.original.actions;
      
      if (!actions) {
        return null;
      }
      
      return (
        <div className="flex items-center space-x-2">
          {actions.onEdit && (
            <button
              onClick={actions.onEdit}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span className="sr-only">Edit</span>
            </button>
          )}
          {actions.onDelete && (
            <button
              onClick={actions.onDelete}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span className="sr-only">Delete</span>
            </button>
          )}
        </div>
      );
    },
  },
]
