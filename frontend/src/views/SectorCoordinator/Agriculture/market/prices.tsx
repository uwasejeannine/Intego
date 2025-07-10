import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2, Package, TrendingDown, Truck} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = import.meta.env.VITE_API_URL || "https://intego360.onrender.com/api/v1/market-prices";

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

const priceColumns = (
  setViewPrice: (row: any) => void,
  setViewPriceOpen: (open: boolean) => void,
  setEditPrice: (row: any) => void,
  setEditPriceOpen: (open: boolean) => void,
  handleDeletePrice: (row: any) => void
) => [
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
    cell: ({ row }: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => { setViewPrice(row.original); setViewPriceOpen(true); }}>
            <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setEditPrice(row.original); setEditPriceOpen(true); }}>
            <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeletePrice(row.original)}>
            <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const MarketPricesPage: React.FC = () => {
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [addPriceOpen, setAddPriceOpen] = useState(false);
  const [viewPrice, setViewPrice] = useState<any>(null);
  const [viewPriceOpen, setViewPriceOpen] = useState(false);
  const [editPrice, setEditPrice] = useState<any>(null);
  const [editPriceOpen, setEditPriceOpen] = useState(false);
  const [newPrice, setNewPrice] = useState({ date: "", crop: "", price: "" });

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPriceHistory(data));
  }, []);

  const handleEditPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/${editPrice.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPrice)
    });
    if (res.ok) {
      const updated = await res.json();
      setPriceHistory(priceHistory.map(p => p.id === updated.id ? updated : p));
      setEditPriceOpen(false);
    }
  };

  const handleDeletePrice = async (price: any) => {
    if (window.confirm("Are you sure you want to delete this price record?")) {
      const res = await fetch(`${API_URL}/${price.id}`, { method: "DELETE" });
      if (res.ok) setPriceHistory(priceHistory.filter(p => p.id !== price.id));
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
              <h1 className="text-2xl font-bold text-gray-900">Market Prices Dashboard</h1>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <PriceMetricCards priceHistory={priceHistory} />
          </div>
          <Card className="w-full dark:bg-slate-500">
            <div className="flex justify-between items-center px-6 pt-6">
              <h2 className="text-lg font-semibold text-[#137775]">Market Prices</h2>
              <Dialog open={addPriceOpen} onOpenChange={setAddPriceOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#137775] text-white">Add Price</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Add New Price</DialogTitle>
                  <form className="space-y-4" onSubmit={e => { e.preventDefault(); setPriceHistory([{ ...newPrice, price: Number(newPrice.price) }, ...priceHistory]); setAddPriceOpen(false); setNewPrice({ date: "", crop: "", price: "" }); }}>
                    <input className="w-full border rounded p-2 text-black" placeholder="Date (YYYY-MM-DD)" value={newPrice.date} onChange={e => setNewPrice({ ...newPrice, date: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Crop" value={newPrice.crop} onChange={e => setNewPrice({ ...newPrice, crop: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Price (RWF/kg)" type="number" value={newPrice.price} onChange={e => setNewPrice({ ...newPrice, price: e.target.value })} required />
                    <Button type="submit" className="bg-[#137775] text-white">Add</Button>
                  </form>
                </DialogContent>
              </Dialog>
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
              <Dialog open={editPriceOpen} onOpenChange={setEditPriceOpen}>
                <DialogContent>
                  <DialogTitle>Edit Price</DialogTitle>
                  {editPrice && (
                    <form className="space-y-4" onSubmit={handleEditPrice}>
                      <input className="w-full border rounded p-2 text-black" placeholder="Date (YYYY-MM-DD)" value={editPrice.date} onChange={e => setEditPrice({ ...editPrice, date: e.target.value })} required />
                      <input className="w-full border rounded p-2 text-black" placeholder="Crop" value={editPrice.crop} onChange={e => setEditPrice({ ...editPrice, crop: e.target.value })} required />
                      <input className="w-full border rounded p-2 text-black" placeholder="Price (RWF/kg)" type="number" value={editPrice.price} onChange={e => setEditPrice({ ...editPrice, price: e.target.value })} required />
                      <input className="w-full border rounded p-2 text-black" placeholder="Unit" value={editPrice.unit} onChange={e => setEditPrice({ ...editPrice, unit: e.target.value })} required />
                      <Button type="submit" className="bg-[#137775] text-white">Save</Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
              <DataTable columns={priceColumns(setViewPrice, setViewPriceOpen, setEditPrice, setEditPriceOpen, handleDeletePrice)} data={priceHistory} userType="sectorCoordinator" initialLoading={false} />
            </div>
          </Card>
        </div>
      </main>
    </>
  );
};

export default MarketPricesPage; 