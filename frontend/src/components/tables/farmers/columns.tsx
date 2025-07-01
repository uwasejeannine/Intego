import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "first_name",
    header: () => <div className="text-center">First Name</div>,
    cell: ({ row }) => <div className="text-center">{row.original.first_name}</div>,
  },
  {
    accessorKey: "last_name",
    header: () => <div className="text-center">Last Name</div>,
    cell: ({ row }) => <div className="text-center">{row.original.last_name}</div>,
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-center">Phone</div>,
    cell: ({ row }) => <div className="text-center">{row.original.phone}</div>,
  },
  {
    accessorKey: "address",
    header: () => <div className="text-center">Address</div>,
    cell: ({ row }) => <div className="text-center">{row.original.address}</div>,
  },
  {
    accessorKey: "primary_crops",
    header: () => <div className="text-center">Primary Crops</div>,
    cell: ({ row }) => {
      const crops = row.original.primary_crops;
      let display = crops;
      if (Array.isArray(crops)) {
        display = crops.join(", ");
      } else if (typeof crops === 'string' && crops.startsWith('[')) {
        try {
          const arr = JSON.parse(crops);
          if (Array.isArray(arr)) display = arr.join(", ");
        } catch {
          display = crops;
        }
      }
      return <div className="text-center">{display}</div>;
    },
  },
  {
    accessorKey: "registration_date",
    header: () => <div className="text-center">Registration Date</div>,
    cell: ({ row }) => {
      const val = row.original.registration_date;
      let display = val;
      if (val && typeof val === 'string') {
        // Try to format as YYYY-MM-DD
        if (val.includes('T')) {
          display = val.slice(0, 10);
        }
      }
      return <div className="text-center">{display}</div>;
    },
  },
]; 