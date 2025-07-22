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

const API_URL = "/api/v1/pesticides";


// Sample pesticide sources
const pesticideSourcesInit = [
  { fullName: "Jean Uwimana", company: "ChemAgro Ltd", location: "Kigali", pesticides: "Lambda-cyhalothrin, Imidacloprid", phone: "0788333444", address: "23 Main St" },
  { fullName: "Claudine Mukamana", company: "PestControl Rwanda", location: "Huye", pesticides: "Glyphosate", phone: "0789555666", address: "67 South Rd" },
];

// Metric Cards Component
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

const pesticideColumns = (
  setViewType: (row: any) => void,
  setViewTypeOpen: (open: boolean) => void,
  setEditType: (row: any) => void,
  setEditTypeOpen: (open: boolean) => void,
  handleDeleteType: (row: any) => void
) => [
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
    cell: ({ row }: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => { setViewType(row.original); setViewTypeOpen(true); }}>
            <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setEditType(row.original); setEditTypeOpen(true); }}>
            <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeleteType(row.original)}>
            <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const PesticidesPage: React.FC = () => {
  const [tab, setTab] = useState("types");
  const [pesticideTypes, setPesticideTypes] = useState<any[]>([]);
  const [sources, setSources] = useState(pesticideSourcesInit);
  // For types actions
  const [addTypeOpen, setAddTypeOpen] = useState(false);
  const [viewType, setViewType] = useState<any>(null);
  const [viewTypeOpen, setViewTypeOpen] = useState(false);
  const [editType, setEditType] = useState<any>(null);
  const [editTypeOpen, setEditTypeOpen] = useState(false);
  const [newType, setNewType] = useState({ name: "", stock: "", distributed: "", shortage: "" });
  // For sources actions
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [viewSource, setViewSource] = useState<any>(null);
  const [viewSourceOpen, setViewSourceOpen] = useState(false);
  const [editSource, setEditSource] = useState<any>(null);
  const [editSourceOpen, setEditSourceOpen] = useState(false);
  const [newSource, setNewSource] = useState({ fullName: "", company: "", location: "", pesticides: "", phone: "", address: "" });

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPesticideTypes(data));
  }, []);

  const handleEditType = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/${editType.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editType)
    });
    if (res.ok) {
      const updated = await res.json();
      setPesticideTypes(pesticideTypes.map(t => t.id === updated.id ? updated : t));
      setEditTypeOpen(false);
    }
  };

  const handleDeleteType = async (type: any) => {
    if (window.confirm("Are you sure you want to delete this pesticide type?")) {
      const res = await fetch(`${API_URL}/${type.id}`, { method: "DELETE" });
      if (res.ok) setPesticideTypes(pesticideTypes.filter(t => t.id !== type.id));
    }
  };

  const handleDeleteSource = (source: any) => {
    if (window.confirm("Are you sure you want to delete this pesticide source?")) {
      setSources(sources.filter((s) => s !== source));
    }
  };

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
                <div className="flex justify-items-end">
                  {tab === "types" && (
                    <Dialog open={addTypeOpen} onOpenChange={setAddTypeOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#137775] text-white">Add Pesticide Type</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Add New Pesticide Type</DialogTitle>
                        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setPesticideTypes([...pesticideTypes, { ...newType, stock: Number(newType.stock), distributed: Number(newType.distributed), shortage: Number(newType.shortage) }]); setAddTypeOpen(false); setNewType({ name: "", stock: "", distributed: "", shortage: "" }); }}>
                          <input className="w-full border rounded p-2 text-black" placeholder="Type" value={newType.name} onChange={e => setNewType({ ...newType, name: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Stock (L)" type="number" value={newType.stock} onChange={e => setNewType({ ...newType, stock: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Distributed (L)" type="number" value={newType.distributed} onChange={e => setNewType({ ...newType, distributed: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Shortage (L)" type="number" value={newType.shortage} onChange={e => setNewType({ ...newType, shortage: e.target.value })} required />
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
                        <DialogTitle>Add New Pesticide Source</DialogTitle>
                        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSources([...sources, newSource]); setAddSourceOpen(false); setNewSource({ fullName: "", company: "", location: "", pesticides: "", phone: "", address: "" }); }}>
                          <input className="w-full border rounded p-2 text-black" placeholder="Full Name" value={newSource.fullName} onChange={e => setNewSource({ ...newSource, fullName: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Company Name" value={newSource.company} onChange={e => setNewSource({ ...newSource, company: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Location" value={newSource.location} onChange={e => setNewSource({ ...newSource, location: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Pesticides They Have" value={newSource.pesticides} onChange={e => setNewSource({ ...newSource, pesticides: e.target.value })} required />
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
                <Dialog open={editTypeOpen} onOpenChange={setEditTypeOpen}>
                  <DialogContent>
                    <DialogTitle>Edit Pesticide Type</DialogTitle>
                    {editType && (
                      <form className="space-y-4" onSubmit={handleEditType}>
                        <input className="w-full border rounded p-2 text-black" placeholder="Type" value={editType.name} onChange={e => setEditType({ ...editType, name: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Stock (L)" type="number" value={editType.stock} onChange={e => setEditType({ ...editType, stock: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Distributed (L)" type="number" value={editType.distributed} onChange={e => setEditType({ ...editType, distributed: e.target.value })} required />
                        <input className="w-full border rounded p-2 text-black" placeholder="Shortage (L)" type="number" value={editType.shortage} onChange={e => setEditType({ ...editType, shortage: e.target.value })} required />
                        <Button type="submit" className="bg-[#137775] text-white">Save</Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <DataTable columns={pesticideColumns(setViewType, setViewTypeOpen, setEditType, setEditTypeOpen, handleDeleteType)} data={pesticideTypes} userType="sectorCoordinator" initialLoading={false} />
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
    </>
  );
};

export default PesticidesPage; 