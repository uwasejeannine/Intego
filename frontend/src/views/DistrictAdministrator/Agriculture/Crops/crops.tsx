import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "@/views/DistrictAdministrator/Navigation/sidebar-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import { DataTable } from "@/components/tables/farmers/data-table";
import { useAuthStore } from "@/stores/authStore";
import { fetchFeedbackForCrop } from "@/lib/api/api";

const API_URL = import.meta.env.VITE_API_URL || "https://intego360.onrender.com/api/v1/crops";
const CURRENT_SEASON_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/current-season` : "https://intego360.onrender.com/api/v1/current-season";
const FEEDBACK_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/feedback` : "https://intego360.onrender.com/api/v1/feedback";

const CROP_COLUMNS = [
  { accessorKey: "crop_name", header: () => <div className="text-center">Crop Name</div>, cell: ({ row }: any) => <div className="text-center">{row.original.crop_name}</div> },
  { accessorKey: "crop_category", header: () => <div className="text-center">Category</div>, cell: ({ row }: any) => <div className="text-center">{row.original.crop_category}</div> },
  { accessorKey: "planting_season", header: () => <div className="text-center">Planting Season</div>, cell: ({ row }: any) => <div className="text-center">{row.original.planting_season}</div> },
  { accessorKey: "growing_duration_days", header: () => <div className="text-center">Duration (months)</div>, cell: ({ row }: any) => {
    const days = row.original.growing_duration_days;
    const months = days ? (Number(days) / 30.44).toFixed(1) : "-";
    return <div className="text-center">{months}</div>;
  } },
  { accessorKey: "expected_yield_per_hectare", header: () => <div className="text-center">Yield/Ha</div>, cell: ({ row }: any) => <div className="text-center">{row.original.expected_yield_per_hectare}</div> },
  { accessorKey: "average_market_price_per_kg", header: () => <div className="text-center">Market Price/kg</div>, cell: ({ row }: any) => <div className="text-center">{row.original.average_market_price_per_kg}</div> },
];

const NUMBER_COLUMN = {
  id: "number",
  header: () => <div className="text-center">#</div>,
  cell: ({ row }: any) => <div className="text-center">{row.index + 1}</div>,
};

export default function CropsPage() {
  const [crops, setCrops] = useState<any[]>([]);
  const [currentSeasonCrops, setCurrentSeasonCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewCrop, setViewCrop] = useState<any>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackCrop, setFeedbackCrop] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [cropFeedbacks, setCropFeedbacks] = useState<Record<string, any[]>>({});
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyFeedback, setReplyFeedback] = useState<any>(null);
  const { userId } = useAuthStore();

  useEffect(() => {
    fetchCrops();
    fetchCurrentSeason();
  }, []);

  useEffect(() => {
    // Fetch feedbacks for all crops
    const fetchAllFeedbacks = async () => {
      const allCrops = [...crops, ...currentSeasonCrops];
      const feedbackMap: Record<string, any[]> = {};
      await Promise.all(
        allCrops.map(async (crop) => {
          const id = crop.crop_id || crop.id;
          if (!id) return;
          const feedbacks = await fetchFeedbackForCrop(id);
          feedbackMap[id] = feedbacks;
        })
      );
      setCropFeedbacks(feedbackMap);
    };
    if (crops.length || currentSeasonCrops.length) {
      fetchAllFeedbacks();
    }
  }, [crops, currentSeasonCrops]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCrops(data?.data || data || []);
    } catch {
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchCurrentSeason = async () => {
    try {
      const res = await fetch(CURRENT_SEASON_URL);
      const data = await res.json();
      setCurrentSeasonCrops(data?.data || data || []);
    } catch {
      setCurrentSeasonCrops([]);
    }
  };

  const handleView = (crop: any) => {
    setViewCrop(crop);
    setViewOpen(true);
  };
  const handleFeedback = (crop: any) => {
    setFeedbackCrop(crop);
    setFeedbackText("");
    setFeedbackOpen(true);
  };
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackCrop || !userId) return;
    setFeedbackSubmitting(true);
    try {
      await fetch(FEEDBACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "crops",
          itemId: feedbackCrop.crop_id || feedbackCrop.id,
          fromUserId: Number(userId),
          toUserId: 1, // Default admin/recipient
          message: feedbackText,
          parentId: null,
        }),
      });
      setFeedbackOpen(false);
      setFeedbackText("");
      setFeedbackCrop(null);
      // Optionally show a toast/notification here
    } finally {
      setFeedbackSubmitting(false);
    }
  };
  const handleReply = (feedback: any) => {
    setReplyFeedback(feedback);
    setReplyText("");
    setReplyOpen(true);
  };
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyFeedback || !userId) return;
    setFeedbackSubmitting(true);
    try {
      await fetch(FEEDBACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "crops",
          itemId: replyFeedback.itemId,
          fromUserId: Number(userId),
          toUserId: replyFeedback.fromUserId, 
          message: replyText,
          parentId: replyFeedback.id,
        }),
      });
      setReplyOpen(false);
      setReplyText("");
      setReplyFeedback(null);
      // Optionally show a toast/notification here
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const COLUMNS_WITH_ACTIONS = [
    NUMBER_COLUMN,
    ...CROP_COLUMNS,
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }: any) => {
        const crop = row.original;
        const cropId = crop.crop_id || crop.id;
        const feedbacks = cropFeedbacks[cropId] || [];
        const userFeedback = feedbacks.find((f: any) => f.fromUserId === Number(userId));
        const hasReply = userFeedback && userFeedback.replies && userFeedback.replies.length > 0;
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleView(crop)}>
                  <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
                </DropdownMenuItem>
                {!userFeedback && (
                  <DropdownMenuItem onClick={() => handleFeedback(crop)}>
                    <Pencil className="h-4 w-4 mr-2 text-green-600" /> Provide Feedback
                  </DropdownMenuItem>
                )}
                {userFeedback && !hasReply && (
                  <DropdownMenuItem disabled>
                    <span className="text-gray-400">Feedback was sent</span>
                  </DropdownMenuItem>
                )}
                {userFeedback && hasReply && (
                  <DropdownMenuItem onClick={() => handleReply(userFeedback)}>
                    <Pencil className="h-4 w-4 mr-2 text-green-600" /> Reply to Feedback
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Navbar />
      <DistrictAdministratorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          <Tabs defaultValue="all" className="w-full max-w-6xl space-y-4">
            <Card className="h-[70px] w-full flex items-center pl-[30px] justify-between dark:bg-slate-500">
              <TabsList className="w-full flex justify-between items-center">
                <div>
                  <TabsTrigger value="all">All Crops</TabsTrigger>
                  <TabsTrigger value="current">Current Season</TabsTrigger>
                </div>
              </TabsList>
            </Card>
            <Card className="w-full dark:bg-slate-500">
              <TabsContent value="all">
                <DataTable columns={COLUMNS_WITH_ACTIONS} data={crops} userType="districtAdmin" initialLoading={loading} />
              </TabsContent>
              <TabsContent value="current">
                <DataTable columns={COLUMNS_WITH_ACTIONS} data={currentSeasonCrops} userType="districtAdmin" initialLoading={loading} />
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </main>
      {/* View Crop Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogTitle className="text-black">Crop Details</DialogTitle>
          {viewCrop && (
            <div className="space-y-2 text-black">
              <div><b>Crop Name:</b> {viewCrop.crop_name}</div>
              <div><b>Category:</b> {viewCrop.crop_category}</div>
              <div><b>Planting Season:</b> {viewCrop.planting_season}</div>
              <div><b>Duration (months):</b> {viewCrop.growing_duration_days}</div>
              <div><b>Yield/Ha:</b> {viewCrop.expected_yield_per_hectare}</div>
              <div><b>Market Price/kg:</b> {viewCrop.average_market_price_per_kg}</div>
              <div><b>Water Requirements:</b> {viewCrop.water_requirements}</div>
              <div><b>Soil Type:</b> {viewCrop.soil_type}</div>
              <div><b>Risk Level:</b> {viewCrop.risk_level}</div>
              <div><b>Suitable for Smallholders:</b> {viewCrop.suitable_for_smallholders ? "Yes" : "No"}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogTitle>Provide Feedback</DialogTitle>
          {feedbackCrop && (
            <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
              <div className="text-black">
                <b>Crop:</b> {feedbackCrop.crop_name}
              </div>
              <textarea
                className="w-full border rounded p-2 text-black min-h-[100px]"
                placeholder="Enter   feedback..."
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
          )}
        </DialogContent>
      </Dialog>
      {/* Reply Dialog */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent>
          <DialogTitle>Reply to Feedback</DialogTitle>
          {replyFeedback && (
            <form className="space-y-4" onSubmit={handleReplySubmit}>
              <div className="text-black">
                <b>Original Feedback:</b> {replyFeedback.message}
              </div>
              <textarea
                className="w-full border rounded p-2 text-black min-h-[100px]"
                placeholder="Enter   reply..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={feedbackSubmitting}>
                  {feedbackSubmitting ? "Submitting..." : "Send Reply"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}