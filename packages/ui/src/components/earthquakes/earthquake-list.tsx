import { useState } from 'react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Earthquake } from '../../types';

export interface EarthquakeListProps {
  earthquakes?: Earthquake[];
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  isLoading?: boolean;
  className?: string;
}

/**
 * Displays a list of earthquakes with sorting and pagination
 */
export function EarthquakeList({
  earthquakes = [],
  onSort,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  isLoading = false,
  className,
}: EarthquakeListProps) {
  const [sortColumn, setSortColumn] = useState<keyof Earthquake | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: keyof Earthquake) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort(column.toString(), newDirection);
    }
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Generate pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageButtons = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // First page button
    if (startPage > 1) {
      pageButtons.push(
        <Button 
          key="first" 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange?.(1)}
          disabled={currentPage === 1}
        >
          1
        </Button>
      );
      
      if (startPage > 2) {
        pageButtons.push(<span key="ellipsis1" className="px-2">...</span>);
      }
    }
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button 
          key={i} 
          variant={currentPage === i ? "default" : "outline"} 
          size="sm" 
          onClick={() => onPageChange?.(i)}
        >
          {i}
        </Button>
      );
    }
    
    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(<span key="ellipsis2" className="px-2">...</span>);
      }
      
      pageButtons.push(
        <Button 
          key="last" 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange?.(totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </Button>
      );
    }
    
    return (
      <div className="flex items-center justify-center gap-1 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {pageButtons}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  // Helper to render sort direction indicator
  const renderSortIndicator = (column: keyof Earthquake) => {
    if (sortColumn !== column) return null;
    
    return sortDirection === 'asc' 
      ? <span className="ml-1">↑</span> 
      : <span className="ml-1">↓</span>;
  };

  return (
    <div className={className ? `space-y-4 ${className}` : "space-y-4"}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('location')}
            >
              Location {renderSortIndicator('location')}
            </TableHead>
            <TableHead 
              className="cursor-pointer w-32"
              onClick={() => handleSort('magnitude')}
            >
              Magnitude {renderSortIndicator('magnitude')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('date')}
            >
              Date/Time {renderSortIndicator('date')}
            </TableHead>
            <TableHead 
              className="cursor-pointer w-32"
              onClick={() => handleSort('depth')}
            >
              Depth (km) {renderSortIndicator('depth')}
            </TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading state
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell className="h-12 bg-muted/30" colSpan={5}></TableCell>
              </TableRow>
            ))
          ) : earthquakes.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No earthquakes found
              </TableCell>
            </TableRow>
          ) : (
            // Data rows
            earthquakes.map((earthquake) => (
              <TableRow key={earthquake.id}>
                <TableCell>{earthquake.location}</TableCell>
                <TableCell>{earthquake.magnitude.toFixed(1)}</TableCell>
                <TableCell>{formatDate(earthquake.date)}</TableCell>
                <TableCell>{earthquake.depth?.toFixed(1) || 'N/A'}</TableCell>
                <TableCell>{earthquake.description ?? 'No description'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {renderPagination()}
    </div>
  );
}
