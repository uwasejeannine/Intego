import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2, Package, TrendingDown, Truck, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = import.meta.env.VITE_API_URL || "https://intego360.onrender.com/api/v1/seeds";


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
  const [addOpen, setAddOpen] = useState(false);
  const [viewSeed, setViewSeed] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [newSeed, setNewSeed] = useState({ name: "", stock: "", distributed: "", shortage: "", source: "" });
  const [editSeed, setEditSeed] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [sources, setSources] = useState<any[]>([]);
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [viewSource, setViewSource] = useState<any>(null);
  const [viewSourceOpen, setViewSourceOpen] = useState(false);
  const [editSource, setEditSource] = useState<any>(null);
  const [editSourceOpen, setEditSourceOpen] = useState(false);
  const [newSource, setNewSource] = useState({ fullName: "", company: "", location: "", seeds: "", phone: "", address: "" });

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setSeedVarieties(data));
  }, []);

  const handleAddSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newSeed,
        stock: Number(newSeed.stock),
        distributed: Number(newSeed.distributed),
        shortage: Number(newSeed.shortage)
      })
    });
    if (res.ok) {
      const created = await res.json();
      setSeedVarieties([...seedVarieties, created]);
      setAddOpen(false);
      setNewSeed({ name: "", stock: "", distributed: "", shortage: "", source: "" });
    }
  };

  const handleEditSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/${editSeed.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSeed)
    });
    if (res.ok) {
      const updated = await res.json();
      setSeedVarieties(seedVarieties.map(s => s.id === updated.id ? updated : s));
      setEditOpen(false);
    }
  };

  const handleDeleteSeed = async (seed: any) => {
    if (window.confirm("Are you sure you want to delete this seed variety?")) {
      const res = await fetch(`${API_URL}/${seed.id}`, { method: "DELETE" });
      if (res.ok) setSeedVarieties(seedVarieties.filter(s => s.id !== seed.id));
    }
  };

  const handleDeleteSource = (source: any) => {
    if (window.confirm("Are you sure you want to delete this seed source?")) {
      setSources(sources.filter((s) => s !== source));
    }
  };

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
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => { setViewSeed(row.original); setViewOpen(true); }}>
              <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setEditSeed(row.original); setEditOpen(true); }}>
              <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteSeed(row.original)}>
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
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
            <DropdownMenuItem onClick={() => handleDeleteSource(row.original)}>
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
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
                <div className="flex justify-items-end">
                  {tab === "varieties" && (
                    <Dialog open={addOpen} onOpenChange={setAddOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#137775] text-white">Add Seed Variety</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Add New Seed Variety</DialogTitle>
                        <form className="space-y-4" onSubmit={handleAddSeed}>
                          <input className="w-full border rounded p-2 text-black" placeholder="Variety Name" value={newSeed.name} onChange={e => setNewSeed({ ...newSeed, name: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Stock (kg)" type="number" value={newSeed.stock} onChange={e => setNewSeed({ ...newSeed, stock: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Distributed (kg)" type="number" value={newSeed.distributed} onChange={e => setNewSeed({ ...newSeed, distributed: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Shortage (kg)" type="number" value={newSeed.shortage} onChange={e => setNewSeed({ ...newSeed, shortage: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Source" value={newSeed.source} onChange={e => setNewSeed({ ...newSeed, source: e.target.value })} required />
                          <Button type="submit" className="bg-[#137775] text-white">Add</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                  {tab === "sources" && (
                    <Dialog open={addSourceOpen} onOpenChange={setAddSourceOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#137775] text-white">Add Source</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Add New Seed Source</DialogTitle>
                        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSources([...sources, newSource]); setAddSourceOpen(false); setNewSource({ fullName: "", company: "", location: "", seeds: "", phone: "", address: "" }); }}>
                          <input className="w-full border rounded p-2 text-black" placeholder="Full Name" value={newSource.fullName} onChange={e => setNewSource({ ...newSource, fullName: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Company Name" value={newSource.company} onChange={e => setNewSource({ ...newSource, company: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Location" value={newSource.location} onChange={e => setNewSource({ ...newSource, location: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Seeds They Have" value={newSource.seeds} onChange={e => setNewSource({ ...newSource, seeds: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Phone Number" value={newSource.phone} onChange={e => setNewSource({ ...newSource, phone: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Address" value={newSource.address} onChange={e => setNewSource({ ...newSource, address: e.target.value })} required />
                          <Button type="submit" className="bg-[#137775] text-white">Add</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
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
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogContent>
                    <DialogTitle>Edit Seed Variety</DialogTitle>
                    {editSeed && (
                      <form className="space-y-4" onSubmit={handleEditSeed}>
                        <input className="w-full border rounded p-2 text-black" placeholder="Variety Name" value={editSeed.name} onChange={e => setEditSeed({ ...editSeed, name: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Stock (kg)" type="number" value={editSeed.stock} onChange={e => setEditSeed({ ...editSeed, stock: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Distributed (kg)" type="number" value={editSeed.distributed} onChange={e => setEditSeed({ ...editSeed, distributed: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Shortage (kg)" type="number" value={editSeed.shortage} onChange={e => setEditSeed({ ...editSeed, shortage: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Source" value={editSeed.source} onChange={e => setEditSeed({ ...editSeed, source: e.target.value })} required />
                        <Button type="submit" className="bg-[#137775] text-white">Save</Button>
                      </form>
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
    </>
  );
};

export default SeedsPage;