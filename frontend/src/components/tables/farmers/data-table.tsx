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
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/tables/users/data-table-pagination";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  userType: string;
  initialLoading: boolean;
  scrollable?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  userType,
  initialLoading,
  scrollable = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<any>([]);
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

  // Custom toolbar for farmers (no roleId logic)
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.getColumn("first_name")?.setFilterValue(value);
    table.getColumn("last_name")?.setFilterValue(value);
  };

  return (
    <div className="flex justify-center items-center h-full w-full rounded-md bg-white dark:bg-slate-500">
      <div className="w-[90%] max-w-[1000px] flex flex-col">
        <div className="flex justify-end py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                placeholder="Search farmers..."
                value={
                  (table.getColumn("first_name")?.getFilterValue() as string) ?? ""
                }
                onChange={handleSearchChange}
                className="h-8 w-[150px] lg:w-[250px]"
              />
            </div>
          </div>
        </div>
        <div className="rounded-md border dark:border-white bg-white">
          {scrollable ? (
            <div className="overflow-auto max-h-[400px]">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-primary text-primary-foreground sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="justify-center items-center justify-items-center">
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="text-white justify-items-center h-12 px-4 text-left align-middle font-medium">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={columns.length} className="h-24 text-center dark:bg-slate-800">
                        <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                          <Progress value={progress} className="w-[60%]" />
                          <p>Loading data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} data-state={row.getIsSelected() && "selected"} className="text-black dark:text-muted-foreground dark:bg-slate-800 dark:border-white cursor-pointer">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-4 align-middle">
                            {flexRender(cell.column.columnDef.cell, {
                              ...cell.getContext(),
                              userType,
                            })}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="h-24 text-center dark:bg-slate-800">
                        No results.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
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
          )}
        </div>
        <div className="flex justify-end py-4">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
} 