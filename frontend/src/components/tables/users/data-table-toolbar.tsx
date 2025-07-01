import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { roles } from "@/types/types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.getColumn("first_name")?.setFilterValue(value);
    table.getColumn("last_name")?.setFilterValue(value);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search users..."
          value={
            (table.getColumn("first_name")?.getFilterValue() as string) ?? ""
          }
          onChange={handleSearchChange}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("roleId") && (
          <DataTableFacetedFilter
            column={table.getColumn("roleId")}
            title="Filter"
            options={roles}
            table={table}
          />
        )}
      </div>
    </div>
  );
}
