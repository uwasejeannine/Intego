import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/tables/farmers/data-table";

const API_URL = import.meta.env.VITE_API_URL || "https://intego360.onrender.com/api/v1/crops";
const CURRENT_SEASON_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/current-season` : "https://intego360.onrender.com/api/v1/current-season";

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
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editCrop, setEditCrop] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewCrop, setViewCrop] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    crop_name: "",
    crop_category: "",
    planting_season: "",
    growing_duration_days: "",
    expected_yield_per_hectare: "",
    average_market_price_per_kg: "",
    water_requirements: "",
    soil_type: "",
    risk_level: "",
    suitable_for_smallholders: false,
  });

  useEffect(() => {
    fetchCrops();
    fetchCurrentSeason();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCrops(data?.data || data || []);
    } catch {
      setCrops([]);
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

  const handleAdd = () => {
    setForm({
      crop_name: "",
      crop_category: "",
      planting_season: "",
      growing_duration_days: "",
      expected_yield_per_hectare: "",
      average_market_price_per_kg: "",
      water_requirements: "",
      soil_type: "",
      risk_level: "",
      suitable_for_smallholders: false,
    });
    setAddOpen(true);
  };
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          growing_duration_days: Number(form.growing_duration_days),
          expected_yield_per_hectare: Number(form.expected_yield_per_hectare),
          average_market_price_per_kg: Number(form.average_market_price_per_kg),
        }),
      });
      setAddOpen(false);
      fetchCrops();
      fetchCurrentSeason();
    } finally {
      setSubmitting(false);
    }
  };
  const handleEdit = (crop: any) => {
    setEditCrop(crop);
    setEditOpen(true);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCrop) return;
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/${editCrop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editCrop,
          growing_duration_days: Number(editCrop.growing_duration_days),
          expected_yield_per_hectare: Number(editCrop.expected_yield_per_hectare),
          average_market_price_per_kg: Number(editCrop.average_market_price_per_kg),
        }),
      });
      setEditOpen(false);
      setEditCrop(null);
      fetchCrops();
      fetchCurrentSeason();
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (crop: any) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/${crop.id}`, { method: "DELETE" });
      fetchCrops();
      fetchCurrentSeason();
    } finally {
      setSubmitting(false);
    }
  };
  const handleView = (crop: any) => {
    setViewCrop(crop);
    setViewOpen(true);
  };

  const COLUMNS_WITH_ACTIONS = [
    NUMBER_COLUMN,
    ...CROP_COLUMNS,
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }: any) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleView(row.original)}>
                <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(row.original)}>
                <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          <Tabs defaultValue="all" className="w-full max-w-6xl space-y-4">
            <Card className="h-[70px] w-full flex items-center pl-[30px] justify-between dark:bg-slate-500">
              <TabsList className="w-full flex justify-between items-center">
                <div>
                  <TabsTrigger value="all">All Crops</TabsTrigger>
                  <TabsTrigger value="current">Current Season</TabsTrigger>
                </div>
                <div className="flex justify-items-end">
                  <Button className="h-8 mr-3 bg-[#137775]" onClick={handleAdd}>
                    Add Crop
                  </Button>
                </div>
              </TabsList>
            </Card>
            <Card className="w-full dark:bg-slate-500">
              <TabsContent value="all">
                <DataTable columns={COLUMNS_WITH_ACTIONS} data={crops} userType="sectorCoordinator" initialLoading={false} />
              </TabsContent>
              <TabsContent value="current">
                <DataTable columns={COLUMNS_WITH_ACTIONS} data={currentSeasonCrops} userType="sectorCoordinator" initialLoading={false} />
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </main>
      {/* Add Crop Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogTitle>Add Crop</DialogTitle>
          <form className="space-y-4" onSubmit={handleAddSubmit}>
            <input name="crop_name" placeholder="Crop Name" value={form.crop_name} onChange={e => setForm({ ...form, crop_name: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="crop_category" placeholder="Category" value={form.crop_category} onChange={e => setForm({ ...form, crop_category: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="planting_season" placeholder="Planting Season" value={form.planting_season} onChange={e => setForm({ ...form, planting_season: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="growing_duration_days" type="number" placeholder="Duration (days)" value={form.growing_duration_days} onChange={e => setForm({ ...form, growing_duration_days: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="expected_yield_per_hectare" type="number" placeholder="Yield/Ha" value={form.expected_yield_per_hectare} onChange={e => setForm({ ...form, expected_yield_per_hectare: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="average_market_price_per_kg" type="number" placeholder="Market Price/kg" value={form.average_market_price_per_kg} onChange={e => setForm({ ...form, average_market_price_per_kg: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="water_requirements" placeholder="Water Requirements" value={form.water_requirements} onChange={e => setForm({ ...form, water_requirements: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="soil_type" placeholder="Soil Type" value={form.soil_type} onChange={e => setForm({ ...form, soil_type: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="risk_level" placeholder="Risk Level" value={form.risk_level} onChange={e => setForm({ ...form, risk_level: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="suitable_for_smallholders" checked={form.suitable_for_smallholders} onChange={e => setForm({ ...form, suitable_for_smallholders: e.target.checked })} className="text-black" />
              <label htmlFor="suitable_for_smallholders" className="text-black">Suitable for Smallholders</label>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Add Crop"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Crop Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogTitle>Edit Crop</DialogTitle>
          {editCrop && (
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <input name="crop_name" placeholder="Crop Name" value={editCrop.crop_name || ''} onChange={e => setEditCrop({ ...editCrop, crop_name: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="crop_category" placeholder="Category" value={editCrop.crop_category || ''} onChange={e => setEditCrop({ ...editCrop, crop_category: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="planting_season" placeholder="Planting Season" value={editCrop.planting_season || ''} onChange={e => setEditCrop({ ...editCrop, planting_season: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="growing_duration_days" type="number" placeholder="Duration (days)" value={editCrop.growing_duration_days || ''} onChange={e => setEditCrop({ ...editCrop, growing_duration_days: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="expected_yield_per_hectare" type="number" placeholder="Yield/Ha" value={editCrop.expected_yield_per_hectare || ''} onChange={e => setEditCrop({ ...editCrop, expected_yield_per_hectare: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="average_market_price_per_kg" type="number" placeholder="Market Price/kg" value={editCrop.average_market_price_per_kg || ''} onChange={e => setEditCrop({ ...editCrop, average_market_price_per_kg: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="water_requirements" placeholder="Water Requirements" value={editCrop.water_requirements || ''} onChange={e => setEditCrop({ ...editCrop, water_requirements: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="soil_type" placeholder="Soil Type" value={editCrop.soil_type || ''} onChange={e => setEditCrop({ ...editCrop, soil_type: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="risk_level" placeholder="Risk Level" value={editCrop.risk_level || ''} onChange={e => setEditCrop({ ...editCrop, risk_level: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="suitable_for_smallholders" checked={!!editCrop.suitable_for_smallholders} onChange={e => setEditCrop({ ...editCrop, suitable_for_smallholders: e.target.checked })} className="text-black" />
                <label htmlFor="suitable_for_smallholders" className="text-black">Suitable for Smallholders</label>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
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
              <div className="flex justify-end pt-4">
                <Button onClick={() => { setViewOpen(false); setEditCrop(viewCrop); setEditOpen(true); }} className="bg-yellow-600 text-white">Edit</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 