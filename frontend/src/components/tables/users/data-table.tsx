import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnDef,
  ColumnFilter,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Progress } from "@/components/ui/progress";
import { UserType } from "@/types/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  userType: UserType;
  initialLoading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  userType,
  initialLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (initialLoading) {
      // Simulate a data fetch
      const fetchData = async () => {
        try {
          const timer = setInterval(() => {
            setProgress((prevProgress) => {
              if (prevProgress >= 100) {
                clearInterval(timer);
                return 100;
              }
              return prevProgress + 10;
            });
          }, 500);

          // Simulate a delay
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setIsLoading(false);
          setProgress(100);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
          setProgress(0);
        }
      };

      fetchData();
    }
  }, [initialLoading]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
  });

  return (
    <div className="flex justify-center items-center h-full w-full rounded-md bg-white dark:bg-slate-500">
      <div className="w-[90%] max-w-[1000px] flex flex-col">
        <div className="flex justify-end py-4">
          <DataTableToolbar table={table} />
        </div>

        <div className="rounded-md border dark:border-white bg-white">
          <Table>
            <TableHeader className="bg-primary text-primary-foreground justify-center items-center justify-items-center">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="justify-center items-center justify-items-center"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-white justify-items-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center dark:bg-slate-800"
                  >
                    <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                      <Progress value={progress} className="w-[60%]" />
                      <p>Loading data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="text-black dark:text-muted-foreground dark:bg-slate-800 dark:border-white cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
                          userType,
                        })}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center dark:bg-slate-800"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end py-4">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
