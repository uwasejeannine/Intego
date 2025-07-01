import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { useNavigate } from "react-router-dom";
import { Report, UserType } from "@/types/types";

interface CellComponentProps {
  row: {
    original: Report;
  };
  userType: UserType;
}

const CellComponent = ({ row, userType }: CellComponentProps) => {
  const navigate = useNavigate();
  const report = row.original;
  const handleViewProject = () => {
    let path = `/project/${report.id}`;
    if (userType === "MandEOfficer") {
      path = `/me-officer${path}`;
    } else if (userType === "projectManager") {
      path = `/manager${path}`;
    } else if (userType === "seniorManagement") {
      path = `/senior${path}`;
    }
    navigate(path, { state: { report, activeTab: "reports" } });
  };
  return (
    <div className="flex items-center justify-center">
      <Button variant="ghost" className="" onClick={handleViewProject}>
        View
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Report>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="bg-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectName",
    header: () => <div className="text-start">Project Name</div>,
    cell: ({ row }) => (
      <div className="text-center items-center justify-start flex">
        {row.original.projectName}
      </div>
    ),
  },
  {
    accessorKey: "numberOfReports",
    header: () => <div className="text-start">No Reports</div>,
    cell: ({ row }) => (
      <div className="text-center items-center justify-start flex">
        {row.original.numberOfReports}
      </div>
    ),
  },
  // Include other columns as needed
  {
    accessorKey: "location",
    header: () => <div className="text-start">Project Location</div>,
    cell: ({ row }) => (
      <div className="text-center items-center justify-start flex">
        {row.original.location}
      </div>
    ),
  },
  {
    accessorKey: "totalProjectBudget",
    header: () => <div className="text-start">Total Project Budget</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.totalProjectBudget.amount}
      </div>
    ),
  },
  {
    accessorKey: "view",
    header: "Action",
    cell: (props) => (
      <CellComponent row={props.row} userType={props.userType} />
    ),
  },
];

export type { Report };
