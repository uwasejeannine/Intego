import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, MinusCircle, MoreHorizontal } from "lucide-react";
import { Profile } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "@/lib/api/api";
import { useToast } from "@/components/ui/use-toast";

// Define a mapping of roleId to role name
const roleMap = {
   2: "admin",  
  3: "districtAdministrator",            
  1: "sectorCoordinator",      
};

interface CellComponentProps {
  row: { original: Profile };
}
const CellComponent = ({ row }: CellComponentProps) => {
  const navigate = useNavigate();
  const user = row.original;
  const handleViewUser = () => {
    const path = `/admin/users/${user.id}`;

    console.log(`path: ${path}`);
    navigate(path, { state: { user } });
  };
  return (
    <div className="" onClick={handleViewUser}>
      View Details
    </div>
  );
};

const DeleteUserComponent = ({ userId }: { userId: number }) => {
  const { toast } = useToast();
  const handleDeleteUser = async () => {
    try {
      await deleteUser(userId);
      setTimeout(() => {
        window.location.reload();
      }, 3000); // Delay of 2 seconds
      toast({
        title: "User Deleted Successfully",
        description: "You have successfully the user",
        icon: <CheckCircle className="w-10 h-10 text-green-900" />,
      });
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: "Error deleting the user. Try again!",
        icon: <MinusCircle className="w-10 h-10 text-red-600" />,
      });
      console.error("Error deleting user:", error);
    }
  };

  return <div onClick={handleDeleteUser}>Delete User</div>;
};

export const columns: ColumnDef<Profile>[] = [
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
    accessorKey: "first_name",
    header: () => <div className="text-center">First Name</div>,
    cell: ({ row }) => (
      <div className="text-center items-center justify-center flex">
        {row.original.first_name}
      </div>
    ),
  },
  {
    accessorKey: "last_name",
    header: () => <div className="text-center">Last Name</div>,
    cell: ({ row }) => (
      <div className="text-center items-center justify-center flex">
        {row.original.last_name}
      </div>
    ),
  },
  {
    accessorKey: "roleId",
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => (
      <div className="text-center items-center justify-center flex">
        {roleMap[row.original.roleId as unknown as keyof typeof roleMap]}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 flex flex-row lg:flex-col items-center justify-center"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="flex flex-col w-full items-center justify-center"
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <CellComponent row={row} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DeleteUserComponent userId={row.original.id ?? 0} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
