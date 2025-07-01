import { startTransition, useMemo, useState } from "react";
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";
import * as RadixSelect from "@radix-ui/react-select";
import { matchSorter } from "match-sorter";
import { CheckIcon, ChevronsDownUp, SearchIcon } from "lucide-react";
import useMediaQuery from "@/hooks/useMediaQuery";

interface CustomSelectProps {
  items: Array<{ id: string; projectName: string }>;
  placeholder: string;
  onSelect: (selectedProject: any) => void;
  error?: string;
}
export const CustomSelect: React.FC<CustomSelectProps> = ({
  items,
  placeholder,
  error,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | number>("");
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const matches = useMemo(() => {
    if (!searchValue) return items;
    const keys = ["projectName"];
    const matches = matchSorter(items, searchValue, { keys });
    const selectedItem = items.find(
      (item) => String(item.id) === String(value),
    );
    if (selectedItem && !matches.includes(selectedItem)) {
      matches.push(selectedItem);
    }
    return matches;
  }, [searchValue, value, items]);

  if (items.length === 0 && error) {
    return <div>{error}</div>;
  }

  const handleValueChange = (value: string) => {
    // Update the value state
    setValue(value);

    // Find the selected item
    const selectedItem = items.find(
      (item) => String(item.id) === String(value),
    );

    // Call the onSelect function with the selected item
    if (selectedItem) {
      onSelect(selectedItem);
    }
  };

  return (
    <RadixSelect.Root
      value={String(value)}
      onValueChange={handleValueChange}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxProvider
        open={open}
        setOpen={setOpen}
        resetValueOnHide
        includesBaseElement={false}
        setValue={(value) => {
          startTransition(() => {
            setSearchValue(value);
          });
        }}
      >
        <RadixSelect.Trigger
          aria-label={placeholder}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <RadixSelect.Value placeholder={`Select a ${placeholder}`} />
          <RadixSelect.Icon className="select-icon">
            <ChevronsDownUp className="h-4 w-4 opacity-50" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Content
          role="dialog"
          aria-label={placeholder}
          position="popper"
          className={`${!isMobile ? "w-[520px]" : "w-[290px]"} py-1.5 text-sm font-semibold rounded-md border  z-[100] bg-white dark:bg-slate-800 shadow-lg`}
          sideOffset={4}
          alignOffset={0}
        >
          <div className="flex items-center border-b px-3 w-full dark:bg-slate-800">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50 text-black dark:text-white" />
            <Combobox
              autoSelect
              placeholder={`Search ${placeholder}`}
              className="flex h-11 w-full rounded-md bg-white dark:bg-slate-800 dark:text-white py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              onBlurCapture={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </div>
          <ComboboxList className="max-h-[300px] w-full overflow-x-hidden">
            {matches.map(({ id, projectName }) => (
              <RadixSelect.Item
                key={`${id}-${projectName}`}
                value={String(id)}
                asChild
                className="relative flex w-full cursor-default items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted dark:hover:bg-slate-600"
              >
                <ComboboxItem>
                  <RadixSelect.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-black dark:text-white">
                    <CheckIcon className="h-4 w-4" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>
                    {String(projectName)}
                  </RadixSelect.ItemText>
                </ComboboxItem>
              </RadixSelect.Item>
            ))}
          </ComboboxList>
        </RadixSelect.Content>
      </ComboboxProvider>
    </RadixSelect.Root>
  );
};
