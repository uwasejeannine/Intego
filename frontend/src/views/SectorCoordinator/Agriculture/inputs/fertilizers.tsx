import React, { useState } from "react";
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

const fertilizerTypesInit = [
  { name: "NPK 17-17-17", stock: 1500, distributed: 1200, shortage: 50 },
  { name: "Urea", stock: 900, distributed: 800, shortage: 20 },
  { name: "DAP", stock: 700, distributed: 600, shortage: 10 },
];

// Sample fertilizer sources
const fertilizerSourcesInit = [
  { fullName: "Alice Niyonsaba", company: "FertiCo Ltd", location: "Kigali", fertilizers: "NPK, Urea", phone: "0788222333", address: "12 Main St" },
  { fullName: "Eric Mugisha", company: "AgroInput Rwanda", location: "Huye", fertilizers: "DAP", phone: "0789444555", address: "45 South Rd" },
];

// Metric Cards Component
const FertilizerMetricCards = ({ fertilizerTypes, sources }: { fertilizerTypes: any[], sources: any[] }) => {
  const totalStock = fertilizerTypes.reduce((sum, f) => sum + f.stock, 0);
  const totalDistributed = fertilizerTypes.reduce((sum, f) => sum + f.distributed, 0);
  const totalShortage = fertilizerTypes.reduce((sum, f) => sum + f.shortage, 0);
  const totalSources = sources.length;

  const metrics = [
    {
      title: 'Total Stock',
      value: `${totalStock.toLocaleString()} kg`,
      change: '+5.1%',
      changeText: 'Since last month',
      isPositive: true,
      icon: Package,
      color: '#2596be',
      bg: 'bg-[#137775]'
    },
    {
      title: 'Distributed',
      value: `${totalDistributed.toLocaleString()} kg`,
      change: '+9.3%',
      changeText: 'Since last month',
      isPositive: true,
      icon: Truck,
      color: '#F89D2D',
      bg: 'bg-[#F89D2D]'
    },
    {
      title: 'Shortage',
      value: `${totalShortage.toLocaleString()} kg`,
      change: '-1.7%',
      changeText: 'Since last month',
      isPositive: true,
      icon: TrendingDown,
      color: '#099773',
      bg: 'bg-[#099773]'
    },
    {
      title: 'Fertilizer Sources',
      value: totalSources.toString(),
      change: '+1',
      changeText: 'New source added',
      isPositive: true,
      icon: Users,
      color: '#2596be',
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

const fertilizerColumns = [
  {
    id: "rowNumber",
    header: "#",
    cell: ({ row }: any) => row.index + 1,
  },
  { accessorKey: "name", header: "Type" },
  { accessorKey: "stock", header: "Stock (kg)" },
  { accessorKey: "distributed", header: "Distributed (kg)" },
  { accessorKey: "shortage", header: "Shortage (kg)" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => null // No actions for types
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
  { accessorKey: "fertilizers", header: "Fertilizers They Have" },
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

const FertilizersPage: React.FC = () => {
  const [tab, setTab] = useState("types");
  const [fertilizerTypes, setFertilizerTypes] = useState(fertilizerTypesInit);
  const [sources, setSources] = useState(fertilizerSourcesInit);
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [viewSource, setViewSource] = useState<any>(null);
  const [viewSourceOpen, setViewSourceOpen] = useState(false);
  const [editSource, setEditSource] = useState<any>(null);
  const [editSourceOpen, setEditSourceOpen] = useState(false);
  const [newSource, setNewSource] = useState({ fullName: "", company: "", location: "", fertilizers: "", phone: "", address: "" });

  const handleDeleteSource = (source: any) => {
    if (window.confirm("Are you sure you want to delete this fertilizer source?")) {
      setSources(sources.filter((s) => s !== source));
    }
  };

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24 min-h-screen">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          <div className="flex w-full max-w-6xl justify-between items-center mb-4">
            <div className="bg-white rounded-lg px-6 py-6 w-full">
              <h1 className="text-2xl font-bold text-gray-900">Fertilizers Management Dashboard</h1>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <FertilizerMetricCards fertilizerTypes={fertilizerTypes} sources={sources} />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="w-full max-w-6xl space-y-4">
            <Card className="h-[70px] w-full flex items-center pl-[30px] justify-between dark:bg-slate-500">
              <TabsList className="w-full flex justify-between items-center">
                <div>
                  <TabsTrigger value="types">Fertilizer Types</TabsTrigger>
                  <TabsTrigger value="sources">Fertilizer Sources</TabsTrigger>
                </div>
                <div className="flex justify-items-end">
                  {tab === "sources" && (
                    <Dialog open={addSourceOpen} onOpenChange={setAddSourceOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#137775] text-white">Add Source</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Add New Fertilizer Source</DialogTitle>
                        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSources([...sources, newSource]); setAddSourceOpen(false); setNewSource({ fullName: "", company: "", location: "", fertilizers: "", phone: "", address: "" }); }}>
                          <input className="w-full border rounded p-2 text-black" placeholder="Full Name" value={newSource.fullName} onChange={e => setNewSource({ ...newSource, fullName: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Company Name" value={newSource.company} onChange={e => setNewSource({ ...newSource, company: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Location" value={newSource.location} onChange={e => setNewSource({ ...newSource, location: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Fertilizers They Have" value={newSource.fertilizers} onChange={e => setNewSource({ ...newSource, fertilizers: e.target.value })} required />
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
              <TabsContent value="types">
                <DataTable columns={fertilizerColumns} data={fertilizerTypes} userType="sectorCoordinator" initialLoading={false} />
              </TabsContent>
              <TabsContent value="sources">
                <Dialog open={viewSourceOpen} onOpenChange={setViewSourceOpen}>
                  <DialogContent>
                    <DialogTitle>Fertilizer Source Details</DialogTitle>
                    {viewSource && (
                      <div className="space-y-2 text-black">
                        <div><b>Full Name:</b> {viewSource.fullName}</div>
                        <div><b>Company Name:</b> {viewSource.company}</div>
                        <div><b>Location:</b> {viewSource.location}</div>
                        <div><b>Fertilizers They Have:</b> {viewSource.fertilizers}</div>
                        <div><b>Phone Number:</b> {viewSource.phone}</div>
                        <div><b>Address:</b> {viewSource.address}</div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Dialog open={editSourceOpen} onOpenChange={setEditSourceOpen}>
                  <DialogContent>
                    <DialogTitle>Edit Fertilizer Source</DialogTitle>
                    {editSource && (
                      <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSources(sources.map(s => s === editSource ? editSource : s)); setEditSourceOpen(false); }}>
                        <input className="w-full border rounded p-2 text-black" placeholder="Full Name" value={editSource.fullName} onChange={e => setEditSource({ ...editSource, fullName: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Company Name" value={editSource.company} onChange={e => setEditSource({ ...editSource, company: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Location" value={editSource.location} onChange={e => setEditSource({ ...editSource, location: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Fertilizers They Have" value={editSource.fertilizers} onChange={e => setEditSource({ ...editSource, fertilizers: e.target.value })} required />
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

export default FertilizersPage; 