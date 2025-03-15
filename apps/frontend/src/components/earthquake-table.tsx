'use client';

import { useState } from 'react';
import { useEarthquakes, type OrderByInput, type PaginationInput, type EarthquakeFilterInput } from '../lib/hooks/use-earthquakes';
import { SortDirection, SortField } from '../lib/types/graphql';

interface EarthquakeTableProps {
  filter?: EarthquakeFilterInput;
}

export function EarthquakeTable({ filter }: EarthquakeTableProps) {
  // State for pagination, sorting, and filtering
  const [pagination, setPagination] = useState<PaginationInput>({
    skip: 0,
    take: 10,
  });

  const [orderBy, setOrderBy] = useState<OrderByInput>({
    field: SortField.DATE,
    direction: SortDirection.DESC,
  });

  // Use our custom hook to fetch earthquakes
  const { earthquakes, pageInfo, loading, error } = useEarthquakes({
    pagination,
    orderBy,
    filter,
  });

  // Handle page changes
  const handleNextPage = () => {
    if (pageInfo.hasNextPage) {
      setPagination((prev) => ({
        ...prev,
        skip: (prev.skip || 0) + (prev.take || 10),
      }));
    }
  };

  const handlePrevPage = () => {
    if (pageInfo.hasPreviousPage) {
      setPagination((prev) => ({
        ...prev,
        skip: Math.max(0, (prev.skip || 0) - (prev.take || 10)),
      }));
    }
  };

  // Handle sorting changes
  const handleSort = (field: SortField) => {
    setOrderBy((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC,
    }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="text-center p-4">Loading earthquakes...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error loading earthquakes: {error.message}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th
              onClick={() => handleSort(SortField.LOCATION)}
              className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
            >
              Location {orderBy.field === SortField.LOCATION && (orderBy.direction === SortDirection.ASC ? '↑' : '↓')}
            </th>
            <th
              onClick={() => handleSort(SortField.MAGNITUDE)}
              className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
            >
              Magnitude{' '}
              {orderBy.field === SortField.MAGNITUDE && (orderBy.direction === SortDirection.ASC ? '↑' : '↓')}
            </th>
            <th
              onClick={() => handleSort(SortField.DATE)}
              className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
            >
              Date {orderBy.field === SortField.DATE && (orderBy.direction === SortDirection.ASC ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {earthquakes.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-2 text-center">
                No earthquakes found
              </td>
            </tr>
          ) : (
            earthquakes.map((earthquake) => (
              <tr key={earthquake.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{earthquake.location}</td>
                <td className="px-4 py-2">{earthquake.magnitude.toFixed(1)}</td>
                <td className="px-4 py-2">{formatDate(earthquake.date)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4 px-4">
        <button
          onClick={handlePrevPage}
          disabled={!pageInfo.hasPreviousPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Showing {(pagination.skip || 0) + 1} to {Math.min((pagination.skip || 0) + (pagination.take || 10), pageInfo.totalCount)} of{' '}
          {pageInfo.totalCount} earthquakes
        </span>
        <button
          onClick={handleNextPage}
          disabled={!pageInfo.hasNextPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
