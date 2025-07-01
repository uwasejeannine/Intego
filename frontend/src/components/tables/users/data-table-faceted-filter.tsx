import * as React from "react";
import { Icons } from "@/components/ui/icons";
import { Column } from "@tanstack/react-table";
import { Table } from "@tanstack/react-table";
import {
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const [selectedValues, setSelectedValues] = React.useState(
    new Set(column?.getFilterValue() as string[]),
  );

  const handleSelect = (value: string) => {
    console.log("Selected value:", value);
    setSelectedValues((prevSelectedValues) => {
      const newSelectedValues = new Set(prevSelectedValues);
      if (newSelectedValues.has(value)) {
        newSelectedValues.delete(value);
      } else {
        newSelectedValues.add(value);
      }
      const filterValues = Array.from(newSelectedValues);
      console.log("Filter values:", filterValues);
      column?.setFilterValue(filterValues.length ? filterValues : undefined);
      return newSelectedValues;
    });
  };

  const handleClearFilters = () => {
    setSelectedValues(new Set());
    column?.setFilterValue(undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed dark:bg-slate-700 dark:text-white "
        >
          <Icons.FilterIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4 " />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal bg-[#137775] hover:bg-[#137775] hover:bg-opacity-90 text-white "
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
      <DropdownMenuContent align="center" className="w-[60px] p-0">
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value);
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
        {selectedValues.size > 0 && (
          <DropdownMenuCheckboxItem
            onSelect={handleClearFilters}
            className="text-center items-center bg-[#137775] text-white"
          >
            Clear filters
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
