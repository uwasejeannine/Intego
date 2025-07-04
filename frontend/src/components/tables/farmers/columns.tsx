import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { MoreHorizontal, Eye, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsDropdown row={row} />,
  },
];

function ActionsDropdown({ row }: { row: any }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const { userId } = useAuthStore();

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitting(true);
    try {
      await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "farmers",
          itemId: row.original.id,
          fromUserId: Number(userId),
          toUserId: row.original.createdById || 1,
          message: feedbackText,
          parentId: null,
        }),
      });
      setFeedbackOpen(false);
      setFeedbackText("");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setViewOpen(true)}>
            <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFeedbackOpen(true)}>
            <Pencil className="h-4 w-4 mr-2 text-green-600" /> Provide Feedback
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* View Details Dialog (simple for now) */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogTitle>Farmer Details</DialogTitle>
          <div className="space-y-2 text-black">
            <div><b>First Name:</b> {row.original.first_name}</div>
            <div><b>Last Name:</b> {row.original.last_name}</div>
            <div><b>Phone:</b> {row.original.phone}</div>
            <div><b>Address:</b> {row.original.address}</div>
            <div><b>Primary Crops:</b> {Array.isArray(row.original.primary_crops) ? row.original.primary_crops.join(", ") : row.original.primary_crops}</div>
            <div><b>Registration Date:</b> {row.original.registration_date}</div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogTitle>Provide Feedback</DialogTitle>
          <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
            <textarea
              className="w-full border rounded p-2 text-black min-h-[100px]"
              placeholder="Enter your feedback..."
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={feedbackSubmitting}>
                {feedbackSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 