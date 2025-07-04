import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "@/views/DistrictAdministrator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Package, TrendingDown, Truck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import { fetchFeedbackForCrop } from "@/lib/api/api";

const API_URL = "/api/v1/market-prices";


// Metric Cards Component
const PriceMetricCards = ({ priceHistory }: { priceHistory: any[] }) => {
  const latest = priceHistory[0]?.price || 0;
  const avg = priceHistory.length ? Math.round(priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length) : 0;
  // Find the cheapest crop
  let cheapest = null;
  if (priceHistory.length) {
    cheapest = priceHistory.reduce((min, p) => (p.price < min.price ? p : min), priceHistory[0]);
  }
  const metrics = [
    {
      title: 'Latest Price',
      value: `${latest} RWF/kg`,
      change: '+2.5%',
      changeText: 'Since last week',
      isPositive: true,
      icon: Package,
      bg: 'bg-[#137775]'
    },
    {
      title: 'Average Price',
      value: `${avg} RWF/kg`,
      change: '+1.1%',
      changeText: 'Since last month',
      isPositive: true,
      icon: Truck,
      bg: 'bg-[#F89D2D]'
    },
    {
      title: 'Cheapest Crop',
      value: cheapest ? `${cheapest.crop}: ${cheapest.price} RWF/kg` : 'N/A',
      change: cheapest ? '+3.0%' : '',
      changeText: cheapest ? 'Since last week' : '',
      isPositive: true,
      icon: TrendingDown,
      bg: 'bg-[#099773]'
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 min-h-[120px]"
          >
            <div className="p-4 flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl ${metric.bg} shadow-lg`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{metric.change}</div>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide pl-4">{metric.title}</h3>
            <div className="text-2xl font-bold text-gray-900 mb-2 pl-4">{metric.value}</div>
            <div className={`mt-2 h-1 rounded-full ${metric.bg} opacity-20 mx-4`}></div>
          </div>
        );
      })}
    </div>
  );
};

const MarketPricesPage: React.FC = () => {
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  // For prices actions
  const [viewPrice, setViewPrice] = useState<any>(null);
  const [viewPriceOpen, setViewPriceOpen] = useState(false);
  // Feedback state/hooks
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackPrice, setFeedbackPrice] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [priceFeedbacks, setPriceFeedbacks] = useState<Record<string, any[]>>({});
  const { userId } = useAuthStore();

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPriceHistory(data));
  }, []);

  // Fetch feedbacks for all prices on load
  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      const feedbackMap: Record<string, any[]> = {};
      await Promise.all(
        priceHistory.map(async (price, idx) => {
          const id = price.id || idx;
          const feedbacks = await fetchFeedbackForCrop(id); // reuse crop feedback API for prices
          feedbackMap[id] = feedbacks;
        })
      );
      setPriceFeedbacks(feedbackMap);
    };
    if (priceHistory.length) {
      fetchAllFeedbacks();
    }
  }, [priceHistory]);

  const handleFeedback = (price: any, idx: number) => {
    setFeedbackPrice({ ...price, idx });
    setFeedbackText("");
    setFeedbackOpen(true);
  };
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackPrice || !userId) return;
    setFeedbackSubmitting(true);
    try {
      await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "market_prices",
          itemId: feedbackPrice.id || feedbackPrice.idx,
          fromUserId: Number(userId),
          toUserId: 1,
          message: feedbackText,
          parentId: null,
        }),
      });
      setFeedbackOpen(false);
      setFeedbackText("");
      setFeedbackPrice(null);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Define priceColumns as a variable inside the component
  const priceColumns = [
    {
      id: "rowNumber",
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "crop", header: "Crop" },
    { accessorKey: "price", header: "Price (RWF/kg)" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const price = row.original;
        const idx = row.index;
        const priceId = price.id || idx;
        const feedbacks = priceFeedbacks[priceId] || [];
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
                <DropdownMenuItem onClick={() => { setViewPrice(price); setViewPriceOpen(true); }}>
                  <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
                </DropdownMenuItem>
                {!userFeedback && (
                  <DropdownMenuItem onClick={() => handleFeedback(price, idx)}>
                    <Pencil className="h-4 w-4 mr-2 text-green-600" /> Provide Feedback
                  </DropdownMenuItem>
                )}
                {userFeedback && !hasReply && (
                  <DropdownMenuItem disabled>
                    <span className="text-gray-400">Feedback was sent</span>
                  </DropdownMenuItem>
                )}
                {userFeedback && hasReply && (
                  <DropdownMenuItem onClick={() => handleFeedback(price, idx)}>
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
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24 min-h-screen">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          <div className="flex w-full max-w-6xl justify-between items-center mb-4">
            <div className="bg-white rounded-lg px-6 py-6 w-full"> 
              <h1 className="text-2xl font-bold text-gray-900">Market Prices Dashboard</h1>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <PriceMetricCards priceHistory={priceHistory} />
          </div>
          <Card className="w-full dark:bg-slate-500">
            <div className="flex justify-between items-center px-6 pt-6">
              <h2 className="text-lg font-semibold text-[#137775]">Market Prices</h2>
            </div>
            <div className="px-6 pb-6">
              <Dialog open={viewPriceOpen} onOpenChange={setViewPriceOpen}>
                <DialogContent>
                  <DialogTitle>Price Details</DialogTitle>
                  {viewPrice && (
                    <div className="space-y-2 text-black">
                      <div><b>Date:</b> {viewPrice.date}</div>
                      <div><b>Crop:</b> {viewPrice.crop}</div>
                      <div><b>Price (RWF/kg):</b> {viewPrice.price}</div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <DataTable columns={priceColumns} data={priceHistory} userType="sectorCoordinator" initialLoading={false} />
            </div>
          </Card>
          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogContent>
              <DialogTitle>Provide Feedback</DialogTitle>
              {feedbackPrice && (
                <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
                  <div className="text-black">
                    <b>Market Price:</b> {feedbackPrice.crop} ({feedbackPrice.date})
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
        </div>
      </main>
    </>
  );
};

export default MarketPricesPage; 