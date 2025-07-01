import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { columns } from "@/components/tables/farmers/columns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const API_URL = "http://localhost:3000/api/v1/farmers/individual/";
const COOP_API_URL = "http://localhost:3000/api/v1/farmers/cooperatives";
const REGIONS_API_URL = "http://localhost:3000/api/v1/farmers/regions";

const COOP_COLUMNS = [
  { accessorKey: "cooperativeName", header: () => <div className="text-center">Name</div>, cell: ({ row }: any) => <div className="text-center">{row.original.cooperativeName}</div> },
  { accessorKey: "location", header: () => <div className="text-center">Location</div>, cell: ({ row }: any) => <div className="text-center">{row.original.location}</div> },
  { accessorKey: "numberOfFarmers", header: () => <div className="text-center"># Farmers</div>, cell: ({ row }: any) => <div className="text-center">{row.original.numberOfFarmers}</div> },
  { accessorKey: "mainCrops", header: () => <div className="text-center">Main Crops</div>, cell: ({ row }: any) => {
    const crops = row.original.mainCrops;
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
  } },
  { accessorKey: "regionId", header: () => <div className="text-center">Region</div>, cell: ({ row }: any) => <div className="text-center">{row.original.regionName || row.original.regionId}</div> },
  { accessorKey: "isActive", header: () => <div className="text-center">Active</div>, cell: ({ row }: any) => <div className="text-center">{row.original.isActive ? "Yes" : "No"}</div> },
];

const FarmersPage: React.FC = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'individual' | 'cooperative'>('individual');
  const [regions, setRegions] = useState<any[]>([]);
  const [coopList, setCoopList] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    region_id: "",
    address: "",
    farm_location: "",
    total_farm_area_hectares: "",
    years_experience: "",
    farmer_type: "commercial",
    primary_crops: "",
    cooperative_id: "",
    registration_date: "2023-08-12",
  });

  const [coopForm, setCoopForm] = useState({
    cooperativeName: "",
    location: "",
    numberOfFarmers: "",
    totalLandSize: "",
    contactPersonPhone: "",
    contactPersonEmail: "",
    mainCrops: "",
    regionId: "",
    isActive: true,
  });

  const [submitting, setSubmitting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editFarmer, setEditFarmer] = useState<any>(null);

  const [editCoopOpen, setEditCoopOpen] = useState(false);
  const [editCoop, setEditCoop] = useState<any>(null);

  const [viewCoopOpen, setViewCoopOpen] = useState(false);
  const [viewCoop, setViewCoop] = useState<any>(null);

  const [viewFarmerOpen, setViewFarmerOpen] = useState(false);
  const [viewFarmer, setViewFarmer] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFarmers();
    fetchCooperatives();
    fetchRegions();
  }, []);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      console.log("Fetched individual farmers:", data);
      setFarmers(data?.data || data || []);
    } catch (e) {
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCooperatives = async () => {
    try {
      const res = await fetch(COOP_API_URL);
      const data = await res.json();
      setCoopList(data?.data || data || []);
    } catch (e) {
      setCoopList([]);
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await fetch(REGIONS_API_URL);
      const data = await res.json();
      // ✅ Fix: extract array from `data`
      setRegions(data?.data || []);
    } catch (e) {
      console.error("Failed to fetch regions", e);
      setRegions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCoopChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCoopForm({ ...coopForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        region_id: form.region_id ? parseInt(form.region_id) : null,
        total_farm_area_hectares: form.total_farm_area_hectares ? parseFloat(form.total_farm_area_hectares) : null,
        years_experience: form.years_experience ? parseInt(form.years_experience) : null,
        primary_crops: form.primary_crops.split(",").map((c) => c.trim()),
        cooperative_id: form.cooperative_id ? parseInt(form.cooperative_id) : null,
      };
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setOpen(false);
      setForm({
        first_name: "", last_name: "", email: "", phone: "", region_id: "",
        address: "", farm_location: "", total_farm_area_hectares: "",
        years_experience: "", farmer_type: "commercial", primary_crops: "",
        cooperative_id: "", registration_date: "2023-08-12"
      });
      fetchFarmers();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCoopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...coopForm,
        regionId: coopForm.regionId ? parseInt(coopForm.regionId) : null,
        numberOfFarmers: coopForm.numberOfFarmers ? parseInt(coopForm.numberOfFarmers) : null,
        totalLandSize: coopForm.totalLandSize ? parseFloat(coopForm.totalLandSize) : null,
        mainCrops: coopForm.mainCrops.split(",").map((c) => c.trim()),
        isActive: coopForm.isActive,
      };
      await fetch(COOP_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setOpen(false);
      setCoopForm({
        cooperativeName: "", location: "", numberOfFarmers: "", totalLandSize: "",
        contactPersonPhone: "", contactPersonEmail: "", mainCrops: "", regionId: "", isActive: true
      });
      fetchFarmers();
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = (farmer: any) => {
    setViewFarmer(farmer);
    setViewFarmerOpen(true);
  };

  const handleEdit = (farmer: any) => {
    setEditFarmer(farmer);
    setEditOpen(true);
  };

  const handleDelete = (farmer: any) => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      console.log("Delete farmer", farmer);
    }
  };

  // Cooperative actions
  const handleViewCoop = (coop: any) => {
    setViewCoop(coop);
    setViewCoopOpen(true);
  };
  const handleEditCoop = (coop: any) => {
    setEditCoop(coop);
    setEditCoopOpen(true);
  };
  const handleDeleteCoop = (coop: any) => {
    if (window.confirm("Are you sure you want to delete this cooperative?")) {
      console.log("Delete cooperative", coop);
    }
  };

  const COOP_ACTIONS_COLUMN = {
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
            <DropdownMenuItem onClick={() => handleViewCoop(row.original)}>
              <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditCoop(row.original)}>
              <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteCoop(row.original)}>
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  };

  // Numbered column for both tables
  const NUMBER_COLUMN = {
    id: "number",
    header: () => <div className="text-center">#</div>,
    cell: ({ row }: any) => <div className="text-center">{row.index + 1}</div>,
  };

  const ACTIONS_COLUMN = {
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
  };

  const INDIVIDUAL_COLUMNS = [
    NUMBER_COLUMN,
    ...columns,
    ACTIONS_COLUMN,
  ];

  const COOP_COLUMNS_WITH_ACTIONS = [
    NUMBER_COLUMN,
    ...COOP_COLUMNS,
    COOP_ACTIONS_COLUMN,
  ];

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFarmer) return;
    setSubmitting(true);
    try {
      const payload = {
        ...editFarmer,
        primary_crops: Array.isArray(editFarmer.primary_crops)
          ? editFarmer.primary_crops
          : (typeof editFarmer.primary_crops === 'string' && editFarmer.primary_crops.startsWith('[')
            ? JSON.parse(editFarmer.primary_crops)
            : editFarmer.primary_crops.split(',').map((c: string) => c.trim())),
      };
      await fetch(`${API_URL}${editFarmer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditOpen(false);
      setEditFarmer(null);
      fetchFarmers();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCoopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCoop) return;
    setSubmitting(true);
    try {
      const payload = {
        ...editCoop,
        mainCrops: Array.isArray(editCoop.mainCrops)
          ? editCoop.mainCrops
          : (typeof editCoop.mainCrops === 'string' && editCoop.mainCrops.startsWith('[')
            ? JSON.parse(editCoop.mainCrops)
            : editCoop.mainCrops.split(',').map((c: string) => c.trim())),
      };
      await fetch(`${COOP_API_URL}/${editCoop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditCoopOpen(false);
      setEditCoop(null);
      fetchCooperatives();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          <Tabs defaultValue="individual" className="w-full max-w-6xl space-y-4">
            <Card className="h-[70px] w-full flex items-center pl-[30px] justify-between dark:bg-slate-500">
              <TabsList className="w-full flex justify-between items-center">
                <div>
                  <TabsTrigger value="individual">Individual Farmers</TabsTrigger>
                  <TabsTrigger value="cooperative">Cooperatives</TabsTrigger>
                </div>
                <div className="flex justify-items-end">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="h-8 mr-3 bg-[#137775]" onClick={() => setOpen(true)}>
                        Add {tab === 'individual' ? 'Individual Farmer' : 'Cooperative'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Add New {tab === 'individual' ? 'Individual Farmer' : 'Cooperative'}</DialogTitle>
                      <div className="flex space-x-2 mb-4">
                        <Button variant={tab === 'individual' ? 'default' : 'outline'} onClick={() => setTab('individual')}>Individual</Button>
                        <Button variant={tab === 'cooperative' ? 'default' : 'outline'} onClick={() => setTab('cooperative')}>Cooperative</Button>
                      </div>
                      {tab === 'individual' ? (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                          <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required className="w-full border rounded p-2 text-black" />
                          <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required className="w-full border rounded p-2 text-black" />
                          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border rounded p-2 text-black" />
                          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full border rounded p-2 text-black" />
                          <select name="region_id" value={form.region_id} onChange={handleChange} required className="w-full border rounded p-2 text-black">
                            <option value="">Select Region</option>
                            {regions.map((r) => (
                              <option key={r.id} value={r.id}>{r.regionName}</option>
                            ))}
                          </select>
                          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="w-full border rounded p-2 text-black" />
                          <input name="farm_location" placeholder="Farm Location" value={form.farm_location} onChange={handleChange} required className="w-full border rounded p-2 text-black" />
                          <input name="total_farm_area_hectares" type="number" placeholder="Total Farm Area (Ha)" value={form.total_farm_area_hectares} onChange={handleChange} required className="w-full border rounded p-2 text-black" />
                          <input name="years_experience" type="number" placeholder="Years Experience" value={form.years_experience} onChange={handleChange} required className="w-full border rounded p-2 text-black" />
                          <select name="farmer_type" value={form.farmer_type} onChange={handleChange} required className="w-full border rounded p-2 text-black">
                            <option value="commercial">Commercial</option>
                            <option value="subsistence">Subsistence</option>
                          </select>
                          <input name="primary_crops" placeholder="Primary Crops (comma separated)" value={form.primary_crops} onChange={handleChange} required className="w-full border rounded p-2 text-black" />
                          <input name="registration_date" type="date" value={form.registration_date} onChange={handleChange} required className="w-full border rounded p-2 text-black" />
                          <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add Farmer"}</Button>
                        </form>
                      ) : (
                        <form className="space-y-4" onSubmit={handleCoopSubmit}>
                          <input name="cooperativeName" placeholder="Cooperative Name" value={coopForm.cooperativeName} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                          <input name="location" placeholder="Location" value={coopForm.location} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                          <input name="numberOfFarmers" type="number" placeholder="Number of Farmers" value={coopForm.numberOfFarmers} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                          <input name="totalLandSize" type="number" placeholder="Total Land Size (Ha)" value={coopForm.totalLandSize} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                          <input name="contactPersonPhone" placeholder="Contact Person Phone" value={coopForm.contactPersonPhone} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                          <input name="contactPersonEmail" placeholder="Contact Person Email" value={coopForm.contactPersonEmail} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                          <select name="regionId" value={coopForm.regionId} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black">
                            <option value="">Select Region</option>
                            {regions.map((r) => (
                              <option key={r.id} value={r.id}>{r.regionName}</option>
                            ))}
                          </select>
                          <input name="mainCrops" placeholder="Main Crops (comma separated)" value={coopForm.mainCrops} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" name="isActive" checked={coopForm.isActive} onChange={e => setCoopForm({ ...coopForm, isActive: e.target.checked })} />
                            <label htmlFor="isActive" className="text-black">Active</label>
                          </div>
                          <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add Cooperative"}</Button>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsList>
            </Card>
            <Card className="w-full dark:bg-slate-500">
              <TabsContent value="individual">
                <DataTable columns={INDIVIDUAL_COLUMNS} data={farmers} userType="sectorCoordinator" initialLoading={loading} />
              </TabsContent>
              <TabsContent value="cooperative">
                <DataTable columns={COOP_COLUMNS_WITH_ACTIONS} data={coopList} userType="sectorCoordinator" initialLoading={loading} />
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </main>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogTitle>Edit Farmer</DialogTitle>
          {editFarmer && (
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <input name="first_name" placeholder="First Name" value={editFarmer.first_name || ''} onChange={e => setEditFarmer({ ...editFarmer, first_name: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="last_name" placeholder="Last Name" value={editFarmer.last_name || ''} onChange={e => setEditFarmer({ ...editFarmer, last_name: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="email" placeholder="Email" value={editFarmer.email || ''} onChange={e => setEditFarmer({ ...editFarmer, email: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="phone" placeholder="Phone" value={editFarmer.phone || ''} onChange={e => setEditFarmer({ ...editFarmer, phone: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="region_id" placeholder="Region ID" value={editFarmer.region_id || ''} onChange={e => setEditFarmer({ ...editFarmer, region_id: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="address" placeholder="Address" value={editFarmer.address || ''} onChange={e => setEditFarmer({ ...editFarmer, address: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="farm_location" placeholder="Farm Location" value={editFarmer.farm_location || ''} onChange={e => setEditFarmer({ ...editFarmer, farm_location: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="total_farm_area_hectares" type="number" placeholder="Total Farm Area (Ha)" value={editFarmer.total_farm_area_hectares || ''} onChange={e => setEditFarmer({ ...editFarmer, total_farm_area_hectares: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="years_experience" type="number" placeholder="Years Experience" value={editFarmer.years_experience || ''} onChange={e => setEditFarmer({ ...editFarmer, years_experience: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <select name="farmer_type" value={editFarmer.farmer_type || 'commercial'} onChange={e => setEditFarmer({ ...editFarmer, farmer_type: e.target.value })} required className="w-full border rounded p-2 text-black">
                <option value="commercial">Commercial</option>
                <option value="subsistence">Subsistence</option>
              </select>
              <input name="primary_crops" placeholder="Primary Crops (comma separated)" value={Array.isArray(editFarmer.primary_crops) ? editFarmer.primary_crops.join(', ') : editFarmer.primary_crops || ''} onChange={e => setEditFarmer({ ...editFarmer, primary_crops: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="registration_date" type="date" value={editFarmer.registration_date && typeof editFarmer.registration_date === 'string' && editFarmer.registration_date.includes('T') ? editFarmer.registration_date.slice(0, 10) : editFarmer.registration_date || ''} onChange={e => setEditFarmer({ ...editFarmer, registration_date: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={editCoopOpen} onOpenChange={setEditCoopOpen}>
        <DialogContent>
          <DialogTitle>Edit Cooperative</DialogTitle>
          {editCoop && (
            <form className="space-y-4" onSubmit={handleEditCoopSubmit}>
              <input name="cooperativeName" placeholder="Cooperative Name" value={editCoop.cooperativeName || ''} onChange={e => setEditCoop({ ...editCoop, cooperativeName: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="location" placeholder="Location" value={editCoop.location || ''} onChange={e => setEditCoop({ ...editCoop, location: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="numberOfFarmers" type="number" placeholder="Number of Farmers" value={editCoop.numberOfFarmers || ''} onChange={e => setEditCoop({ ...editCoop, numberOfFarmers: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="totalLandSize" type="number" placeholder="Total Land Size (Ha)" value={editCoop.totalLandSize || ''} onChange={e => setEditCoop({ ...editCoop, totalLandSize: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="contactPersonPhone" placeholder="Contact Person Phone" value={editCoop.contactPersonPhone || ''} onChange={e => setEditCoop({ ...editCoop, contactPersonPhone: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="contactPersonEmail" placeholder="Contact Person Email" value={editCoop.contactPersonEmail || ''} onChange={e => setEditCoop({ ...editCoop, contactPersonEmail: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="mainCrops" placeholder="Main Crops (comma separated)" value={Array.isArray(editCoop.mainCrops) ? editCoop.mainCrops.join(', ') : editCoop.mainCrops || ''} onChange={e => setEditCoop({ ...editCoop, mainCrops: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <select name="regionId" value={editCoop.regionId || ''} onChange={e => setEditCoop({ ...editCoop, regionId: e.target.value })} required className="w-full border rounded p-2 text-black">
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.regionName}</option>
                ))}
              </select>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="isActive" checked={!!editCoop.isActive} onChange={e => setEditCoop({ ...editCoop, isActive: e.target.checked })} />
                <label htmlFor="isActive" className="text-black">Active</label>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={viewFarmerOpen} onOpenChange={setViewFarmerOpen}>
        <DialogContent>
          <DialogTitle className="text-black">Farmer Details</DialogTitle>
          {viewFarmer && (
            <div className="space-y-2 text-black">
              <div><b>Name:</b> {viewFarmer.first_name} {viewFarmer.last_name}</div>
              <div><b>Email:</b> {viewFarmer.email}</div>
              <div><b>Phone:</b> {viewFarmer.phone}</div>
              <div><b>Region:</b> {viewFarmer.regionName || viewFarmer.region_id}</div>
              <div><b>Address:</b> {viewFarmer.address}</div>
              <div><b>Farm Location:</b> {viewFarmer.farm_location}</div>
              <div><b>Total Farm Area (Ha):</b> {viewFarmer.total_farm_area_hectares}</div>
              <div><b>Years Experience:</b> {viewFarmer.years_experience}</div>
              <div><b>Farmer Type:</b> {viewFarmer.farmer_type}</div>
              <div><b>Primary Crops:</b> {Array.isArray(viewFarmer.primary_crops) ? viewFarmer.primary_crops.join(", ") : (typeof viewFarmer.primary_crops === 'string' && viewFarmer.primary_crops.startsWith('[') ? JSON.parse(viewFarmer.primary_crops).join(", ") : viewFarmer.primary_crops)}</div>
              <div><b>Cooperative:</b> {viewFarmer.cooperativeName || viewFarmer.cooperative_id || "-"}</div>
              <div><b>Registration Date:</b> {viewFarmer.registration_date && typeof viewFarmer.registration_date === 'string' && viewFarmer.registration_date.includes('T') ? viewFarmer.registration_date.slice(0, 10) : viewFarmer.registration_date}</div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => { setViewFarmerOpen(false); setEditFarmer(viewFarmer); setEditOpen(true); }} className="bg-yellow-600 text-white">Edit</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={viewCoopOpen} onOpenChange={setViewCoopOpen}>
        <DialogContent>
          <DialogTitle className="text-black">Cooperative Details</DialogTitle>
          {viewCoop && (
            <div className="space-y-2 text-black">
              <div><b>Name:</b> {viewCoop.cooperativeName}</div>
              <div><b>Location:</b> {viewCoop.location}</div>
              <div><b>Number of Farmers:</b> {viewCoop.numberOfFarmers}</div>
              <div><b>Main Crops:</b> {Array.isArray(viewCoop.mainCrops) ? viewCoop.mainCrops.join(", ") : (typeof viewCoop.mainCrops === 'string' && viewCoop.mainCrops.startsWith('[') ? JSON.parse(viewCoop.mainCrops).join(", ") : viewCoop.mainCrops)}</div>
              <div><b>Region:</b> {viewCoop.regionName || viewCoop.regionId}</div>
              <div><b>Contact Person Phone:</b> {viewCoop.contactPersonPhone}</div>
              <div><b>Contact Person Email:</b> {viewCoop.contactPersonEmail}</div>
              <div><b>Total Land Size (Ha):</b> {viewCoop.totalLandSize}</div>
              <div><b>Active:</b> {viewCoop.isActive ? "Yes" : "No"}</div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => { setViewCoopOpen(false); setEditCoop(viewCoop); setEditCoopOpen(true); }} className="bg-yellow-600 text-white">Edit</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FarmersPage;
