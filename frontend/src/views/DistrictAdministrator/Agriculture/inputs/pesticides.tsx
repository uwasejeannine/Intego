import * as React from 'react';
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "@/views/DistrictAdministrator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

const API_URL = "/api/v1/pesticides";


const pesticideSourcesInit = [
  { id: 1, fullName: "Jean Uwimana", company: "ChemAgro Ltd", location: "Kigali", pesticides: "Lambda-cyhalothrin, Imidacloprid", phone: "0788333444", address: "23 Main St" },
  { id: 2, fullName: "Claudine Mukamana", company: "PestControl Rwanda", location: "Huye", pesticides: "Glyphosate", phone: "0789555666", address: "67 South Rd" },
];

const PesticideMetricCards = ({ pesticideTypes, sources }: { pesticideTypes: any[], sources: any[] }) => {
  const totalStock = pesticideTypes.reduce((sum, p) => sum + p.stock, 0);
  const totalDistributed = pesticideTypes.reduce((sum, p) => sum + p.distributed, 0);
  const totalShortage = pesticideTypes.reduce((sum, p) => sum + p.shortage, 0);
  const totalSources = sources.length;

  const metrics = [
    {
      title: 'Total Stock',
      value: `${totalStock.toLocaleString()} L`,
      change: '+4.7%',
      changeText: 'Since last month',
      isPositive: true,
      icon: Package,
      color: '#137775',
      bg: 'bg-[#137775]'
    },
    {
      title: 'Distributed',
      value: `${totalDistributed.toLocaleString()} L`,
      change: '+7.8%',
      changeText: 'Since last month',
      isPositive: true,
      icon: Truck,
      color: '#F89D2D',
      bg: 'bg-[#F89D2D]'
    },
    {
      title: 'Shortage',
      value: `${totalShortage.toLocaleString()} L`,
      change: '-0.9%',
      changeText: 'Since last month',
      isPositive: true,
      icon: TrendingDown,
      color: '#099773',
      bg: 'bg-[#099773]'
    },
    {
      title: 'Pesticide Sources',
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

const PesticidesPage: React.FC = () => {
  const [tab, setTab] = useState("types");
  const [pesticideTypes, setPesticideTypes] = useState<any[]>([]);
  const [sources, setSources] = useState(pesticideSourcesInit);
  const [viewType, setViewType] = useState<any>(null);
  const [viewTypeOpen, setViewTypeOpen] = useState(false);
  const [viewSource, setViewSource] = useState<any>(null);
  const [viewSourceOpen, setViewSourceOpen] = useState(false);
  const [editSource, setEditSource] = useState<any>(null);
  const [editSourceOpen, setEditSourceOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackPesticide, setFeedbackPesticide] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [pesticideFeedbacks, setPesticideFeedbacks] = useState<Record<string, any[]>>({});
  const [feedbackSourceOpen, setFeedbackSourceOpen] = useState(false);
  const [feedbackSource, setFeedbackSource] = useState<any>(null);
  const [feedbackSourceText, setFeedbackSourceText] = useState("");
  const [feedbackSourceSubmitting, setFeedbackSourceSubmitting] = useState(false);
  const [sourceFeedbacks, setSourceFeedbacks] = useState<Record<string, any[]>>({});
  const { userId } = useAuthStore();

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPesticideTypes(data));
  }, []);

  // Fetch feedbacks for all pesticides on load
  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      const feedbackMap: Record<string, any[]> = {};
      await Promise.all(
        pesticideTypes.map(async (pesticide) => {
          const id = pesticide.id;
          if (!id) return;
          const feedbacks = await fetchFeedbackForCrop(id); // reuse crop feedback API for pesticides
          feedbackMap[id] = feedbacks;
        })
      );
      setPesticideFeedbacks(feedbackMap);
    };
    if (pesticideTypes.length) {
      fetchAllFeedbacks();
    }
  }, [pesticideTypes]);

  // Fetch feedbacks for all sources on load
  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      const feedbackMap: Record<string, any[]> = {};
      await Promise.all(
        sources.map(async (source, idx) => {
          // Use idx as unique key if no id
          const id = source.id || idx;
          const feedbacks = await fetchFeedbackForCrop(id); // reuse crop feedback API for sources
          feedbackMap[id] = feedbacks;
        })
      );
      setSourceFeedbacks(feedbackMap);
    };
    if (sources.length) {
      fetchAllFeedbacks();
    }
  }, [sources]);

  const handleFeedback = (pesticide: any) => {
    setFeedbackPesticide(pesticide);
    setFeedbackText("");
    setFeedbackOpen(true);
  };
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackPesticide || !userId) return;
    setFeedbackSubmitting(true);
    try {
      await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "pesticides",
          itemId: feedbackPesticide.id,
          fromUserId: Number(userId),
          toUserId: 1,
          message: feedbackText,
          parentId: null,
        }),
      });
      setFeedbackOpen(false);
      setFeedbackText("");
      setFeedbackPesticide(null);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleSourceFeedback = (source: any, idx: number) => {
    setFeedbackSource({ ...source, idx });
    setFeedbackSourceText("");
    setFeedbackSourceOpen(true);
  };
  const handleSourceFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackSource || !userId) return;
    setFeedbackSourceSubmitting(true);
    try {
      await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "pesticide_sources",
          itemId: (feedbackSource as any).id || feedbackSource.idx,
          fromUserId: Number(userId),
          toUserId: 1,
          message: feedbackSourceText,
          parentId: null,
        }),
      });
      setFeedbackSourceOpen(false);
      setFeedbackSourceText("");
      setFeedbackSource(null);
    } finally {
      setFeedbackSourceSubmitting(false);
    }
  };

  // Move pesticideColumns inside the component to access state/hooks
  const pesticideColumns = [
    {
      id: "rowNumber",
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "name", header: "Type" },
    { accessorKey: "stock", header: "Stock (L)" },
    { accessorKey: "distributed", header: "Distributed (L)" },
    { accessorKey: "shortage", header: "Shortage (L)" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const pesticide = row.original;
        const pesticideId = pesticide.id;
        const feedbacks = pesticideFeedbacks[pesticideId] || [];
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
                <DropdownMenuItem onClick={() => { setViewType(pesticide); setViewTypeOpen(true); }}>
                  <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
                </DropdownMenuItem>
                {!userFeedback && (
                  <DropdownMenuItem onClick={() => handleFeedback(pesticide)}>
                    <Pencil className="h-4 w-4 mr-2 text-green-600" /> Provide Feedback
                  </DropdownMenuItem>
                )}
                {userFeedback && !hasReply && (
                  <DropdownMenuItem disabled>
                    <span className="text-gray-400">Feedback was sent</span>
                  </DropdownMenuItem>
                )}
                {userFeedback && hasReply && (
                  <DropdownMenuItem onClick={() => handleFeedback(pesticide)}>
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
    { accessorKey: "fullName", header: "Full Name" },
    { accessorKey: "company", header: "Company Name" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "pesticides", header: "Pesticides They Have" },
    { accessorKey: "phone", header: "Phone Number" },
    { accessorKey: "address", header: "Address" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const source = row.original;
        const idx = row.index;
        const sourceId = (source as any).id || idx;
        const feedbacks = sourceFeedbacks[sourceId] || [];
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
                <DropdownMenuItem onClick={() => { setViewSource(source); setViewSourceOpen(true); }}>
                  <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
                </DropdownMenuItem>
                {!userFeedback && (
                  <DropdownMenuItem onClick={() => handleSourceFeedback(source, idx)}>
                    <Pencil className="h-4 w-4 mr-2 text-green-600" /> Provide Feedback
                  </DropdownMenuItem>
                )}
                {userFeedback && !hasReply && (
                  <DropdownMenuItem disabled>
                    <span className="text-gray-400">Feedback was sent</span>
                  </DropdownMenuItem>
                )}
                {userFeedback && hasReply && (
                  <DropdownMenuItem onClick={() => handleSourceFeedback(source, idx)}>
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
            <h1 className="text-2xl font-bold text-gray-900">Pesticides / Chemicals Management Dashboard</h1>
          </div>
          <div className="w-full max-w-6xl">
            <PesticideMetricCards pesticideTypes={pesticideTypes} sources={sources} />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="w-full max-w-6xl space-y-4">
            <Card className="h-[70px] w-full flex items-center pl-[30px] justify-between dark:bg-slate-500">
              <TabsList className="w-full flex justify-between items-center">
                <div>
                  <TabsTrigger value="types">Pesticide Types</TabsTrigger>
                  <TabsTrigger value="sources">Pesticide Sources</TabsTrigger>
                </div>
              </TabsList>
            </Card>
            <Card className="w-full dark:bg-slate-500">
              <TabsContent value="types">
                <Dialog open={viewTypeOpen} onOpenChange={setViewTypeOpen}>
                  <DialogContent>
                    <DialogTitle>Pesticide Type Details</DialogTitle>
                    {viewType && (
                      <div className="space-y-2 text-black">
                        <div><b>Type:</b> {viewType.name}</div>
                        <div><b>Stock (L):</b> {viewType.stock}</div>
                        <div><b>Distributed (L):</b> {viewType.distributed}</div>
                        <div><b>Shortage (L):</b> {viewType.shortage}</div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <DataTable columns={pesticideColumns} data={pesticideTypes} userType="sectorCoordinator" initialLoading={false} />
              </TabsContent>
              <TabsContent value="sources">
                <Dialog open={viewSourceOpen} onOpenChange={setViewSourceOpen}>
                  <DialogContent>
                    <DialogTitle>Pesticide Source Details</DialogTitle>
                    {viewSource && (
                      <div className="space-y-2 text-black">
                        <div><b>Full Name:</b> {viewSource.fullName}</div>
                        <div><b>Company Name:</b> {viewSource.company}</div>
                        <div><b>Location:</b> {viewSource.location}</div>
                        <div><b>Pesticides They Have:</b> {viewSource.pesticides}</div>
                        <div><b>Phone Number:</b> {viewSource.phone}</div>
                        <div><b>Address:</b> {viewSource.address}</div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Dialog open={editSourceOpen} onOpenChange={setEditSourceOpen}>
                  <DialogContent>
                    <DialogTitle>Edit Pesticide Source</DialogTitle>
                    {editSource && (
                      <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSources(sources.map(s => s === editSource ? editSource : s)); setEditSourceOpen(false); }}>
                        <input className="w-full border rounded p-2 text-black" placeholder="Full Name" value={editSource.fullName} onChange={e => setEditSource({ ...editSource, fullName: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Company Name" value={editSource.company} onChange={e => setEditSource({ ...editSource, company: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Location" value={editSource.location} onChange={e => setEditSource({ ...editSource, location: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Pesticides They Have" value={editSource.pesticides} onChange={e => setEditSource({ ...editSource, pesticides: e.target.value })} required />
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
          {feedbackPesticide && (
            <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
              <div className="text-black">
                <b>Pesticide Type:</b> {feedbackPesticide.name}
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
      <Dialog open={feedbackSourceOpen} onOpenChange={setFeedbackSourceOpen}>
        <DialogContent>
          <DialogTitle>Provide Feedback</DialogTitle>
          {feedbackSource && (
            <form className="space-y-4" onSubmit={handleSourceFeedbackSubmit}>
              <div className="text-black">
                <b>Pesticide Source:</b> {feedbackSource.fullName}
              </div>
              <textarea
                className="w-full border rounded p-2 text-black min-h-[100px]"
                placeholder="Enter   feedback..."
                value={feedbackSourceText}
                onChange={e => setFeedbackSourceText(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={feedbackSourceSubmitting}>
                  {feedbackSourceSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PesticidesPage; 