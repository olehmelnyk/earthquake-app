"use client"

import { ColumnDef } from "@tanstack/react-table"

// Match the Earthquake interface from the frontend
export interface EarthquakeTableData {
  id: string
  magnitude: number
  place: string
  time: string
  location?: string
  date?: string
}

export const earthquakeColumns: ColumnDef<EarthquakeTableData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "magnitude",
    header: "Magnitude",
    cell: ({ row }) => {
      const magnitude = parseFloat(row.getValue("magnitude"))
      return <div className="font-medium">{magnitude.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "place",
    header: "Location",
    cell: ({ row }) => {
      // Use place or location depending on what's available
      const place = row.getValue("place") as string
      const location = row.original.location
      return <div>{place || location || "Unknown"}</div>
    },
  },
  {
    accessorKey: "time",
    header: "Date & Time",
    cell: ({ row }) => {
      // Use time or date depending on what's available
      const time = row.getValue("time") as string
      const date = row.original.date
      
      if (time) {
        // Format ISO date string to a more readable format
        const formattedDate = new Date(time).toLocaleString()
        return <div>{formattedDate}</div>
      }
      
      return <div>{date || "Unknown"}</div>
    },
  },
]
