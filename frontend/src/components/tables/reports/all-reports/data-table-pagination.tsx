import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>; // Props for DataTablePagination component
}

/**
 * DataTablePagination component for pagination controls in a data table.
 * @template TData - Type of data in the table.
 * @param {Object} props - Component props.
 * @param {Table<TData>} props.table - React Table instance representing the table.
 */
export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center px-2">
      {/* Display selected row count */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground justify-items-start dark:text-slate-100">
        <span>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-6 lg:space-x-8 justify-items-end text-black dark:text-white pl-[10px]">
        {/* Rows per page dropdown */}
        <div className="flex items-center space-x-2 justify-end">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current page information */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        {/* Pagination navigation buttons */}
        <div className="flex items-center space-x-2 justify-end">
          {/* First page button */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex dark:bg-slate-600 dark:hover:bg-slate-700"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4 dark:text-white" />
          </Button>

          {/* Previous page button */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 dark:bg-slate-600 dark:hover:bg-slate-700"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4 dark:text-white" />
          </Button>

          {/* Next page button */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 dark:bg-slate-600 dark:hover:bg-slate-700"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4 dark:text-white" />
          </Button>

          {/* Last page button */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex dark:bg-slate-600 dark:hover:bg-slate-700"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4 dark:text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
