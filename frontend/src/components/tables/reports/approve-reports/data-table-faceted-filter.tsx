import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import { Column, Table, ColumnFilter } from "@tanstack/react-table";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  table: Table<TData>;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  table,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    (column?.getFilterValue() as string[]) || [],
  );

  const handleSelect = (value: string) => {
    setSelectedValues((prevSelectedValues) => {
      const newSelectedValues = [...prevSelectedValues];
      const index = newSelectedValues.indexOf(value);
      if (index !== -1) {
        newSelectedValues.splice(index, 1);
      } else {
        newSelectedValues.push(value);
      }
      column?.setFilterValue(
        newSelectedValues.length > 0 ? newSelectedValues : undefined,
      );

      if (column?.id) {
        table.setColumnFilters([
          {
            id: column.id,
            value: newSelectedValues.length > 0 ? newSelectedValues : undefined,
          },
        ]);
      }

      return newSelectedValues;
    });
  };

  const handleClearFilters = () => {
    setSelectedValues([]);
    column?.setFilterValue(undefined);
    if (column?.id) {
      table.setColumnFilters([]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed dark:bg-slate-700 dark:text-white"
        >
          <Icons.FilterIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal bg-primary hover:bg-primary hover:bg-opacity-90 text-primary-foreground"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-full p-0">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isSelected}
              onCheckedChange={() => handleSelect(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          );
        })}
        {selectedValues.length > 0 && (
          <DropdownMenuCheckboxItem
            onSelect={handleClearFilters}
            className="text-center items-center bg-primary hover:bg-primary hover:bg-opacity-90 text-primary-foreground"
          >
            Clear filters
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
