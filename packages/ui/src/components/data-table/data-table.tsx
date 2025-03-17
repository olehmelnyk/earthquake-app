"use client"

import { useState, useEffect, useRef } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  OnChangeFn,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
} from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number
  searchable?: boolean
  searchColumn?: string
  onEdit?: (item: TData) => void
  onDelete?: (item: TData) => void
  onPageChange?: (pagination: { skip: number; take: number }) => void
  onSortChange?: (field: string, direction: "asc" | "desc") => void
  onSearch?: (searchTerm: string) => void
  currentPagination?: { skip: number; take: number }
  currentSorting?: { field: string; direction: "asc" | "desc" }
  totalCount?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  searchable = false,
  searchColumn,
  onEdit,
  onDelete,
  onPageChange,
  onSortChange,
  onSearch,
  currentPagination,
  currentSorting,
  totalCount,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(
    currentSorting ? [{ id: currentSorting.field, desc: currentSorting.direction === "desc" }] : []
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Initialize globalFilter with the search term from URL if available
  const [globalFilter, setGlobalFilter] = useState<string>(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('search') || "";
    }
    return "";
  });

  // Use server-side pagination and sorting if callbacks are provided
  const serverSidePagination = !!onPageChange;
  const serverSideSorting = !!onSortChange;
  const serverSideSearch = !!onSearch;

  // Handle sorting changes
  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    // Handle both function updater and direct value
    const updatedSorting = typeof updaterOrValue === 'function'
      ? updaterOrValue(sorting)
      : updaterOrValue;

    setSorting(updatedSorting);

    if (serverSideSorting && updatedSorting.length > 0) {
      const sortItem = updatedSorting[0];
      onSortChange?.(
        sortItem.id,
        sortItem.desc ? "desc" : "asc"
      );
    }
  }

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);

    if (serverSideSearch) {
      // Instead of calling onSearch immediately, set a timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        onSearch?.(value);
      }, 500); // 500ms delay
    }
  };

  // Ref for debouncing search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverSidePagination ? undefined : getPaginationRowModel(),
    onSortingChange: handleSortingChange,
    getSortedRowModel: serverSideSorting ? undefined : getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
      ...(serverSidePagination ? {} : {
        pagination: {
          pageSize,
          pageIndex: currentPagination ? Math.floor((currentPagination.skip || 0) / (currentPagination.take || pageSize)) : 0,
        },
      }),
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
    manualPagination: serverSidePagination,
    manualSorting: serverSideSorting,
    pageCount: serverSidePagination && totalCount ? Math.ceil(totalCount / (currentPagination?.take || pageSize)) : undefined,
  })

  // For server-side pagination
  const currentPage = currentPagination ? Math.floor((currentPagination.skip || 0) / (currentPagination.take || pageSize)) : 0;
  const handlePreviousPage = () => {
    if (onPageChange && currentPagination) {
      onPageChange({
        skip: Math.max(0, (currentPagination.skip || 0) - (currentPagination.take || pageSize)),
        take: currentPagination.take || pageSize,
      });
    } else if (!serverSidePagination) {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    if (onPageChange && currentPagination && totalCount &&
        (currentPagination.skip || 0) + (currentPagination.take || pageSize) < totalCount) {
      onPageChange({
        skip: (currentPagination.skip || 0) + (currentPagination.take || pageSize),
        take: currentPagination.take || pageSize,
      });
    } else if (!serverSidePagination) {
      table.nextPage();
    }
  };

  // Calculate display information
  let startRow, endRow, filteredRowsLength;

  if (serverSidePagination && currentPagination && totalCount) {
    startRow = (currentPagination.skip || 0) + 1;
    endRow = Math.min((currentPagination.skip || 0) + (currentPagination.take || pageSize), totalCount);
    filteredRowsLength = totalCount;
  } else {
    const { pageSize: currentPageSize, pageIndex } = table.getState().pagination;
    filteredRowsLength = table.getFilteredRowModel().rows.length;
    startRow = pageIndex * currentPageSize + 1;
    endRow = Math.min((pageIndex + 1) * currentPageSize, filteredRowsLength);
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder={`Search ${searchColumn || ""}...`}
              value={globalFilter}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanSort() && (
                        <Button
                          variant="ghost"
                          onClick={() => header.column.toggleSorting()}
                          className="ml-1 p-0 h-4"
                        >
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : (
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          )}
                        </Button>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {onEdit || onDelete ? (
                    <TableCell className="flex space-x-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(row.original)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(row.original)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {data.length === 0 ? "No data available" : "No results found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {filteredRowsLength > 0 ? (
            <span>
              Showing {startRow} to {endRow} of {filteredRowsLength} records
            </span>
          ) : (
            <span>No records found</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center text-sm font-medium mr-4">
            Page {serverSidePagination ? currentPage + 1 : table.getState().pagination.pageIndex + 1} of{" "}
            {serverSidePagination && totalCount
              ? Math.ceil(totalCount / (currentPagination?.take || pageSize))
              : table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={serverSidePagination
              ? (currentPagination?.skip || 0) === 0
              : !table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={serverSidePagination
              ? (currentPagination?.skip || 0) + (currentPagination?.take || pageSize) >= (totalCount || 0)
              : !table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
