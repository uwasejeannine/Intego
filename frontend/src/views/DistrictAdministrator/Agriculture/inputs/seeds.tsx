import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "@/views/DistrictAdministrator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Package, TrendingDown, Truck, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import { fetchFeedbackForCrop } from "@/lib/api/api";

const API_URL = "/api/v1/seeds";

// Metric Cards Component
const SeedMetricCards = ({ seedVarieties, sources }: { seedVarieties: any[], sources: any[] }) => {
  const totalStock = seedVarieties.reduce((sum, seed) => sum + seed.stock, 0);
  const totalDistributed = seedVarieties.reduce((sum, seed) => sum + seed.distributed, 0);
  const totalShortage = seedVarieties.reduce((sum, seed) => sum + seed.shortage, 0);
  const totalSources = sources.length;

  const metrics = [
    {
      title: 'Total Stock',
      value: `${totalStock.toLocaleString()} kg`,
      change: '+8.2%',
      changeText: 'Since last month',
      isPositive: true,
      icon: Package,
      color: '#137775',
      bg: 'bg-[#137775]'
    },
    {
      title: 'Distributed',
      value: `${totalDistributed.toLocaleString()} kg`,
      change: '+12.5%',
      changeText: 'Since last month',
      isPositive: true,
      icon: Truck,
      color: '#F89D2D',
      bg: 'bg-[#F89D2D]'
    },
    {
      title: 'Shortage',
      value: `${totalShortage.toLocaleString()} kg`,
      change: '-2.1%',
      changeText: 'Since last month',
      isPositive: true,
      icon: TrendingDown,
      color: '#099773',
      bg: 'bg-[#099773]'
    },
    {
      title: 'Seed Sources',
      value: totalSources.toString(),
      change: '+1',
      changeText: 'New source added',
      isPositive: true,
      icon: Users,
      color: '#144c49',
      bg: 'bg-[#144c49]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 min-h-[120px]"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${metric.bg} shadow-lg`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  metric.isPositive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {metric.change}
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                {metric.title}
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {metric.value}
              </div>
              <div className="flex items-center text-xs">
                <span className={`font-medium ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-gray-500 ml-1">
                  {metric.changeText}
                </span>
              </div>
              <div className={`mt-2 h-1 rounded-full ${metric.bg} opacity-20`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SeedsPage: React.FC = () => {
  const [tab, setTab] = useState("varieties");
  const [seedVarieties, setSeedVarieties] = useState<any[]>([]);
  const [viewSeed, setViewSeed] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [sources, setSources] = useState<any[]>([]);
  const [viewSource, setViewSource] = useState<any>(null);
  const [viewSourceOpen, setViewSourceOpen] = useState(false);
  const [editSource, setEditSource] = useState<any>(null);
  const [editSourceOpen, setEditSourceOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSeed, setFeedbackSeed] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [seedFeedbacks, setSeedFeedbacks] = useState<Record<string, any[]>>({});
  const { userId } = useAuthStore();

  // Fetch feedbacks for all seeds on load
  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      const feedbackMap: Record<string, any[]> = {};
      await Promise.all(
        seedVarieties.map(async (seed) => {
          const id = seed.id;
          if (!id) return;
          const feedbacks = await fetchFeedbackForCrop(id); 
          feedbackMap[id] = feedbacks;
        })
      );
      setSeedFeedbacks(feedbackMap);
    };
    if (seedVarieties.length) {
      fetchAllFeedbacks();
    }
  }, [seedVarieties]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setSeedVarieties(data));
  }, []);




  const handleFeedback = (seed: any) => {
    setFeedbackSeed(seed);
    setFeedbackText("");
    setFeedbackOpen(true);
  };
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackSeed || !userId) return;
    setFeedbackSubmitting(true);
    try {
      await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "seeds",
          itemId: feedbackSeed.id,
          fromUserId: Number(userId),
          toUserId: 1,
          message: feedbackText,
          parentId: null,
        }),
      });
      setFeedbackOpen(false);
      setFeedbackText("");
      setFeedbackSeed(null);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Update seedColumns actions
  const seedColumns = [
    {
      id: "rowNumber",
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "name", header: "Variety" },
    { accessorKey: "stock", header: "Stock (kg)" },
    { accessorKey: "distributed", header: "Distributed (kg)" },
    { accessorKey: "shortage", header: "Shortage (kg)" },
    { accessorKey: "source", header: "Source" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const seed = row.original;
        const seedId = seed.id;
        const feedbacks = seedFeedbacks[seedId] || [];
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
                <DropdownMenuItem onClick={() => { setViewSeed(seed); setViewOpen(true); }}>
                  <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
                </DropdownMenuItem>
                {!userFeedback && (
                  <DropdownMenuItem onClick={() => handleFeedback(seed)}>
                    <Pencil className="h-4 w-4 mr-2 text-green-600" /> Provide Feedback
                  </DropdownMenuItem>
                )}
                {userFeedback && !hasReply && (
                  <DropdownMenuItem disabled>
                    <span className="text-gray-400">Feedback was sent</span>
                  </DropdownMenuItem>
                )}
                {userFeedback && hasReply && (
                  <DropdownMenuItem onClick={() => handleFeedback(seed)}>
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

  const sourceColumns = [
    {
      id: "rowNumber",
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "fullName", header: "Full Name" },
    { accessorKey: "company", header: "Company Name" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "seeds", header: "Seeds They Have" },
    { accessorKey: "phone", header: "Phone Number" },
    { accessorKey: "address", header: "Address" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => { setViewSource(row.original); setViewSourceOpen(true); }}>
              <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setEditSource(row.original); setEditSourceOpen(true); }}>
              <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <DistrictAdministratorSidebar/>
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24 min-h-screen">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          <div className="flex w-full max-w-6xl justify-between items-center mb-4">
            <div className="bg-white rounded-lg px-6 py-6 w-full">
              <h1 className="text-2xl font-bold text-gray-900">Seeds Management Dashboard</h1>
            </div>
          </div>

          {/* Beautiful Metric Cards */}
          <div className="w-full max-w-6xl">
            <SeedMetricCards seedVarieties={seedVarieties} sources={sources} />
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full max-w-6xl space-y-4">
            <Card className="h-[70px] w-full flex items-center pl-[30px] justify-between dark:bg-slate-500">
              <TabsList className="w-full flex justify-between items-center">
                <div>
                  <TabsTrigger value="varieties">Seed Varieties</TabsTrigger>
                  <TabsTrigger value="sources">Seed Sources</TabsTrigger>
                </div>
              </TabsList>
            </Card>
            <Card className="w-full dark:bg-slate-500">
              <TabsContent value="varieties">
                <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                  <DialogContent>
                    <DialogTitle>Seed Variety Details</DialogTitle>
                    {viewSeed && (
                      <div className="space-y-2 text-black">
                        <div><b>Variety:</b> {viewSeed.name}</div>
                        <div><b>Stock (kg):</b> {viewSeed.stock}</div>
                        <div><b>Distributed (kg):</b> {viewSeed.distributed}</div>
                        <div><b>Shortage (kg):</b> {viewSeed.shortage}</div>
                        <div><b>Source:</b> {viewSeed.source}</div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
       
                <DataTable columns={seedColumns} data={seedVarieties} userType="sectorCoordinator" initialLoading={false} />
              </TabsContent>
              <TabsContent value="sources">
                <Dialog open={viewSourceOpen} onOpenChange={setViewSourceOpen}>
                  <DialogContent>
                    <DialogTitle>Seed Source Details</DialogTitle>
                    {viewSource && (
                      <div className="space-y-2 text-black">
                        <div><b>Full Name:</b> {viewSource.fullName}</div>
                        <div><b>Company Name:</b> {viewSource.company}</div>
                        <div><b>Location:</b> {viewSource.location}</div>
                        <div><b>Seeds They Have:</b> {viewSource.seeds}</div>
                        <div><b>Phone Number:</b> {viewSource.phone}</div>
                        <div><b>Address:</b> {viewSource.address}</div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Dialog open={editSourceOpen} onOpenChange={setEditSourceOpen}>
                  <DialogContent>
                    <DialogTitle>Edit Seed Source</DialogTitle>
                    {editSource && (
                      <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSources(sources.map(s => s === editSource ? editSource : s)); setEditSourceOpen(false); }}>
                        <input className="w-full border rounded p-2 text-black" placeholder="Full Name" value={editSource.fullName} onChange={e => setEditSource({ ...editSource, fullName: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Company Name" value={editSource.company} onChange={e => setEditSource({ ...editSource, company: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Location" value={editSource.location} onChange={e => setEditSource({ ...editSource, location: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Seeds They Have" value={editSource.seeds} onChange={e => setEditSource({ ...editSource, seeds: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Phone Number" value={editSource.phone} onChange={e => setEditSource({ ...editSource, phone: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Address" value={editSource.address} onChange={e => setEditSource({ ...editSource, address: e.target.value })} required />
                        <Button type="submit" className="bg-[#137775] text-white">Save</Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <DataTable columns={sourceColumns} data={sources} userType="sectorCoordinator" initialLoading={false} />
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </main>
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogTitle>Provide Feedback</DialogTitle>
          {feedbackSeed && (
            <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
              <div className="text-black">
                <b>Seed Variety:</b> {feedbackSeed.name}
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
    </>
  );
};

export default SeedsPage;