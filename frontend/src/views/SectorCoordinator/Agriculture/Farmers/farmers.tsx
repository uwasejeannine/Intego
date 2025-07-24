import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { columns } from "@/components/tables/farmers/columns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api/api"; // ✅ Import the configured API instance

// ✅ Use relative paths since api instance already has baseURL
const API_URL = "/farmers/individual/";
const COOP_API_URL = "/farmers/cooperatives";
const REGIONS_API_URL = "/farmers/regions";

const COOP_COLUMNS = [
  { accessorKey: "cooperative_name", header: () => <div className="text-center">Name</div>, cell: ({ row }: any) => <div className="text-center">{row.original.cooperative_name}</div> },
  { accessorKey: "location", header: () => <div className="text-center">Location</div>, cell: ({ row }: any) => <div className="text-center">{row.original.location}</div> },
  { accessorKey: "number_of_farmers", header: () => <div className="text-center"># Farmers</div>, cell: ({ row }: any) => <div className="text-center">{row.original.number_of_farmers}</div> },
  { accessorKey: "main_crops", header: () => <div className="text-center">Main Crops</div>, cell: ({ row }: any) => {
    const crops = row.original.main_crops || row.original.mainCropsArray;
    let display = crops || "-";
    if (Array.isArray(crops)) {
      display = crops.length > 0 ? crops.join(", ") : "-";
    } else if (typeof crops === 'string' && crops.startsWith('[')) {
      try {
        const arr = JSON.parse(crops);
        if (Array.isArray(arr)) display = arr.length > 0 ? arr.join(", ") : "-";
      } catch {
        display = crops || "-";
      }
    }
    return <div className="text-center">{display}</div>;
  } },
  { accessorKey: "region_id", header: () => <div className="text-center">Region</div>, cell: ({ row }: any) => <div className="text-center">{row.original.region?.region_name || row.original.region_id}</div> },
  { accessorKey: "is_active", header: () => <div className="text-center">Active</div>, cell: ({ row }: any) => <div className="text-center">{row.original.is_active ? "Yes" : "No"}</div> },
];

const FarmersPage: React.FC = () => {
  const [farmers, setFarmers] = useState([]);
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
    cooperative_name: "",
    location: "",
    number_of_farmers: "",
    total_land_size: "",
    contact_person_phone: "",
    contact_person_email: "",
    main_crops: "",
    region_id: "",
    is_active: true,
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

  useEffect(() => {
    fetchFarmers();
    fetchCooperatives();
    fetchRegions();
  }, []);

  // ✅ Replace fetch with api instance
  const fetchFarmers = async () => {
    try {
      const res = await api.get(API_URL);
      const data = res.data;
      console.log("Fetched individual farmers:", data);
      setFarmers(data?.data || data || []);
    } catch (e) {
      console.error("Error fetching farmers:", e);
      setFarmers([]);
    }
  };

  // ✅ Replace fetch with api instance
  const fetchCooperatives = async () => {
    try {
      const res = await api.get(COOP_API_URL);
      const data = res.data;
      setCoopList(data?.data || data || []);
    } catch (e) {
      console.error("Error fetching cooperatives:", e);
      setCoopList([]);
    }
  };

  // ✅ Replace fetch with api instance
  const fetchRegions = async () => {
    try {
      const res = await api.get(REGIONS_API_URL);
      const data = res.data;
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

  // ✅ Replace fetch with api instance
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
      await api.post(API_URL, payload);
      setOpen(false);
      setForm({
        first_name: "", last_name: "", email: "", phone: "", region_id: "",
        address: "", farm_location: "", total_farm_area_hectares: "",
        years_experience: "", farmer_type: "commercial", primary_crops: "",
        cooperative_id: "", registration_date: "2023-08-12"
      });
      fetchFarmers();
    } catch (error) {
      console.error("Error adding farmer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Replace fetch with api instance
  const handleCoopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...coopForm,
        region_id: coopForm.region_id ? parseInt(coopForm.region_id) : null,
        number_of_farmers: coopForm.number_of_farmers ? parseInt(coopForm.number_of_farmers) : null,
        total_land_size: coopForm.total_land_size ? parseFloat(coopForm.total_land_size) : null,
        main_crops: coopForm.main_crops ? coopForm.main_crops.split(",").map((c) => c.trim()) : [],
        is_active: coopForm.is_active,
      };
      await api.post(COOP_API_URL, payload);
      setOpen(false);
      setCoopForm({
        cooperative_name: "", location: "", number_of_farmers: "", total_land_size: "",
        contact_person_phone: "", contact_person_email: "", main_crops: "", region_id: "", is_active: true
      });
      fetchCooperatives(); // ✅ Fix: should call fetchCooperatives, not fetchFarmers
    } catch (error) {
      console.error("Error adding cooperative:", error);
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

  const handleDelete = async (farmer: any) => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      try {
        await api.delete(`${API_URL}${farmer.id}`);
        fetchFarmers();
      } catch (error) {
        console.error("Error deleting farmer:", error);
      }
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
  
  const handleDeleteCoop = async (coop: any) => {
    if (window.confirm("Are you sure you want to delete this cooperative?")) {
      try {
        await api.delete(`${COOP_API_URL}/${coop.id}`);
        fetchCooperatives();
      } catch (error) {
        console.error("Error deleting cooperative:", error);
      }
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

  // ✅ Replace fetch with api instance
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
      await api.put(`${API_URL}${editFarmer.id}`, payload);
      setEditOpen(false);
      setEditFarmer(null);
      fetchFarmers();
    } catch (error) {
      console.error("Error updating farmer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Replace fetch with api instance
  const handleEditCoopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCoop) return;
    setSubmitting(true);
    try {
      const payload = {
        ...editCoop,
        main_crops: Array.isArray(editCoop.main_crops)
          ? editCoop.main_crops
          : (typeof editCoop.main_crops === 'string' && editCoop.main_crops.startsWith('[')
            ? JSON.parse(editCoop.main_crops)
            : editCoop.main_crops ? editCoop.main_crops.split(',').map((c: string) => c.trim()) : []),
      };
      await api.put(`${COOP_API_URL}/${editCoop.id}`, payload);
      setEditCoopOpen(false);
      setEditCoop(null);
      fetchCooperatives();
    } catch (error) {
      console.error("Error updating cooperative:", error);
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
                      <ScrollArea className="max-h-[400px] p-2">
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
                            <input name="cooperative_name" placeholder="Cooperative Name" value={coopForm.cooperative_name} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                            <input name="location" placeholder="Location" value={coopForm.location} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                            <input name="number_of_farmers" type="number" placeholder="Number of Farmers" value={coopForm.number_of_farmers} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                            <input name="total_land_size" type="number" placeholder="Total Land Size (Ha)" value={coopForm.total_land_size} onChange={handleCoopChange} className="w-full border rounded p-2 text-black" />
                            <input name="contact_person_phone" placeholder="Contact Person Phone" value={coopForm.contact_person_phone} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black" />
                            <input name="contact_person_email" placeholder="Contact Person Email" value={coopForm.contact_person_email} onChange={handleCoopChange} className="w-full border rounded p-2 text-black" />
                            <select name="region_id" value={coopForm.region_id} onChange={handleCoopChange} required className="w-full border rounded p-2 text-black">
                              <option value="">Select Region</option>
                              {regions.map((r) => (
                                <option key={r.id} value={r.id}>{r.regionName}</option>
                              ))}
                            </select>
                            <input name="main_crops" placeholder="Main Crops (comma separated)" value={coopForm.main_crops} onChange={handleCoopChange} className="w-full border rounded p-2 text-black" />
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" name="is_active" checked={coopForm.is_active} onChange={e => setCoopForm({ ...coopForm, is_active: e.target.checked })} />
                              <label htmlFor="is_active" className="text-black">Active</label>
                            </div>
                            <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add Cooperative"}</Button>
                          </form>
                        )}
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsList>
            </Card>
            <Card className="w-full dark:bg-slate-500">
              <TabsContent value="individual">
                <DataTable columns={INDIVIDUAL_COLUMNS} data={farmers} userType="sectorCoordinator" />
              </TabsContent>
              <TabsContent value="cooperative">
                <DataTable columns={COOP_COLUMNS_WITH_ACTIONS} data={coopList} userType="sectorCoordinator" />
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
              <input name="cooperative_name" placeholder="Cooperative Name" value={editCoop.cooperative_name || ''} onChange={e => setEditCoop({ ...editCoop, cooperative_name: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="location" placeholder="Location" value={editCoop.location || ''} onChange={e => setEditCoop({ ...editCoop, location: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="number_of_farmers" type="number" placeholder="Number of Farmers" value={editCoop.number_of_farmers || ''} onChange={e => setEditCoop({ ...editCoop, number_of_farmers: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="total_land_size" type="number" placeholder="Total Land Size (Ha)" value={editCoop.total_land_size || ''} onChange={e => setEditCoop({ ...editCoop, total_land_size: e.target.value })} className="w-full border rounded p-2 text-black" />
              <input name="contact_person_phone" placeholder="Contact Person Phone" value={editCoop.contact_person_phone || ''} onChange={e => setEditCoop({ ...editCoop, contact_person_phone: e.target.value })} required className="w-full border rounded p-2 text-black" />
              <input name="contact_person_email" placeholder="Contact Person Email" value={editCoop.contact_person_email || ''} onChange={e => setEditCoop({ ...editCoop, contact_person_email: e.target.value })} className="w-full border rounded p-2 text-black" />
              <input name="main_crops" placeholder="Main Crops (comma separated)" value={Array.isArray(editCoop.main_crops) ? editCoop.main_crops.join(', ') : editCoop.main_crops || ''} onChange={e => setEditCoop({ ...editCoop, main_crops: e.target.value })} className="w-full border rounded p-2 text-black" />
              <select name="region_id" value={editCoop.region_id || ''} onChange={e => setEditCoop({ ...editCoop, region_id: e.target.value })} required className="w-full border rounded p-2 text-black">
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.regionName}</option>
                ))}
              </select>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="is_active" checked={!!editCoop.is_active} onChange={e => setEditCoop({ ...editCoop, is_active: e.target.checked })} />
                <label htmlFor="is_active" className="text-black">Active</label>
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
              <div><b>Name:</b> {viewCoop.cooperative_name}</div>
              <div><b>Location:</b> {viewCoop.location}</div>
              <div><b>Number of Farmers:</b> {viewCoop.number_of_farmers}</div>
              <div><b>Main Crops:</b> {Array.isArray(viewCoop.main_crops) ? viewCoop.main_crops.join(", ") : (Array.isArray(viewCoop.mainCropsArray) ? viewCoop.mainCropsArray.join(", ") : (typeof viewCoop.main_crops === 'string' && viewCoop.main_crops.startsWith('[') ? JSON.parse(viewCoop.main_crops).join(", ") : viewCoop.main_crops || "-"))}</div>
              <div><b>Region:</b> {viewCoop.region?.region_name || viewCoop.region_id}</div>
              <div><b>Contact Person Phone:</b> {viewCoop.contact_person_phone}</div>
              <div><b>Contact Person Email:</b> {viewCoop.contact_person_email || "-"}</div>
              <div><b>Total Land Size (Ha):</b> {viewCoop.total_land_size || "-"}</div>
              <div><b>Active:</b> {viewCoop.is_active ? "Yes" : "No"}</div>
              <div><b>Farmers:</b> {viewCoop.farmers && viewCoop.farmers.length > 0 ? viewCoop.farmers.map((f: any) => `${f.first_name} ${f.last_name}`).join(", ") : "-"}</div>
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