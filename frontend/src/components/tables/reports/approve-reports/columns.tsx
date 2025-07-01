import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { useNavigate } from "react-router-dom";
import { Report, UserType } from "@/types/types";
import { CheckCheck, Circle, X } from "lucide-react";
export type { Report };

interface CellComponentProps {
  row: {
    original: Report;
  };
  userType: UserType;
}
const CellComponent = ({ row, userType }: CellComponentProps) => {
  const navigate = useNavigate();
  const report = row.original;

  const handleViewReport = () => {
    let path = `/approveReport/${report.id}`;
    if (userType === "MandEOfficer") {
      path = `/me-officer${path}`;
    } else if (userType === "projectManager") {
      path = `/manager${path}`;
    } else if (userType === "seniorManagement") {
      path = `/senior${path}`;
    }
    navigate(path, { state: { report } });
  };

  return (
    <div className="flex items-center justify-center">
      <Button variant="ghost" className="" onClick={handleViewReport}>
        View
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">S/N</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center items-center justify-center flex">
          {row.original.id}
        </div>
      );
    },
  },
  {
    accessorKey: "projectName",
    header: () => <div className="text-start">Project Name</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center items-center justify-start flex">
          {row.original.projectName}
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: () => <div className="text-start">Location</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center items-center justify-start flex">
          {row.original.location}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created At</div>,
    cell: ({ row }) => {
      let formattedDate = "";
      if (row.original.createdAt) {
        const createdAt = new Date(row.original.createdAt);
        formattedDate = createdAt.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
      return (
        <div className="text-center items-center flex justify-center justify-items-center">
          {formattedDate}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      let statusColorClass = "";
      switch (row.original.status) {
        case "Pending":
          statusColorClass =
            "bg-primary bg-opacity-2 text-primary-foreground dark:text-primary-foreground";
          break;
        case "Ongoing":
          statusColorClass = "bg-orange-400 text-white";
          break;
        case "Completed":
          statusColorClass = "bg-green-400";
          break;
        case "Stopped":
          statusColorClass = "bg-gray-300  text-gray-400";
          break;
        default:
          statusColorClass = "";
      }
      return (
        <div className="flex items-center justify-center">
          <Badge className={`text-center ${statusColorClass}`}>
            {row.original.status}
          </Badge>
        </div>
      );
    },
  },

  // Action column for viewing project details
  {
    accessorKey: "view",
    header: () => <div className="text-center">Action</div>,
    cell: (props) => (
      <CellComponent row={props.row} userType={props.userType} />
    ),
  },
];
