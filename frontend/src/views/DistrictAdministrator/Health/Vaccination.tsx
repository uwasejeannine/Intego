import React, { useEffect, useState } from "react";
import { Card} from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "../Navigation/sidebar-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2, Syringe, Users, Percent, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/tables/farmers/data-table";

const API_URL = import.meta.env.VITE_API_URL || "https://intego360.onrender.com/api/v1";
const VACCINES_API = `${API_URL}/vaccines`;
const FACILITIES_API = `${API_URL}/hospital`;
const VACC_RECORDS_API = `${API_URL}/vaccination-records`;

// Metric Cards Component
type VaccinationMetric = { title: string; value: string | number; icon: any; color: string; bg: string };
const VaccinationMetricCards = ({ metrics }: { metrics: VaccinationMetric[] }) => (
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
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
              {metric.title}
            </h3>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {metric.value}
            </div>
            <div className={`mt-2 h-1 rounded-full ${metric.bg} opacity-20`}></div>
          </div>
        </div>
      );
    })}
  </div>
);

// Helper to format date as YYYY-MM-DD
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toISOString().slice(0, 10);
};

const Vaccination: React.FC = () => {
  const [tab, setTab] = useState("vaccines");
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewVacc, setViewVacc] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editVacc, setEditVacc] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Facilities and vaccination records
  const [facilities, setFacilities] = useState<any[]>([]);
  const [vaccinationRecords, setVaccinationRecords] = useState<any[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(true);

  // Compute metrics for cards from actual vaccines data
  const now = new Date();
  const soon = new Date();
  soon.setDate(now.getDate() + 30);
  const totalVaccines = vaccinations.length;
  const totalStock = vaccinations.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  const expiringSoon = vaccinations.filter(v => v.expiry_date && new Date(v.expiry_date) <= soon).length;
  const activeVaccines = vaccinations.filter(v => v.status === 'active').length;
  const metrics = [
    { title: "Total Vaccines", value: totalVaccines, icon: Syringe, color: "#099773", bg: "bg-[#099773]" },
    { title: "Total Stock", value: totalStock, icon: Percent, color: "#ef8f20", bg: "bg-[#ef8f20]" },
    { title: "Expiring Soon", value: expiringSoon, icon: Calendar, color: "#137775", bg: "bg-[#137775]" },
    { title: "Active Vaccines", value: activeVaccines, icon: Users, color: "#144c49", bg: "bg-[#144c49]" },
  ];

  useEffect(() => {
    // Fetch vaccines
    fetch(VACCINES_API)
      .then(res => res.json())
      .then(data => setVaccinations(Array.isArray(data) ? data : data.data || []))
      .catch(() => setVaccinations([]))
      .finally(() => setLoading(false));
    // Fetch facilities
    fetch(FACILITIES_API)
      .then(res => res.json())
      .then(data => setFacilities(Array.isArray(data) ? data : data.data || []))
      .catch(() => setFacilities([]));
    // Fetch vaccination records
    fetch(VACC_RECORDS_API)
      .then(res => res.json())
      .then(data => setVaccinationRecords(Array.isArray(data) ? data : data.data || []))
      .catch(() => setVaccinationRecords([]))
      .finally(() => setRecordsLoading(false));
  }, []);

  const handleEditVacc = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/vaccination/${editVacc.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editVacc)
    });
    if (res.ok) {
      const updated = await res.json();
      setVaccinations(vaccinations.map(v => v.id === updated.id ? updated : v));
      setEditOpen(false);
    }
  };

  const handleDeleteVacc = async (vacc: any) => {
    if (window.confirm("Are you sure you want to delete this vaccination?")) {
      const res = await fetch(`${API_URL}/vaccination/${vacc.id}`, { method: "DELETE" });
      if (res.ok) setVaccinations(vaccinations.filter(v => v.id !== vacc.id));
    }
  };

  // DataTable columns for vaccines
  const vaccColumns = [
    { id: "rowNumber", header: "#", cell: ({ row }: any) => row.index + 1 },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "manufacturer", header: "Manufacturer" },
    { accessorKey: "stock", header: "Stock" },
    { accessorKey: "expiry_date", header: "Expiry Date", cell: ({ row }: any) => formatDate(row.original.expiry_date) },
    { accessorKey: "batch_number", header: "Batch Number" },
    { accessorKey: "status", header: "Status" },
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
            <DropdownMenuItem onClick={() => { setViewVacc(row.original); setViewOpen(true); }}>
              <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setEditVacc(row.original); setEditOpen(true); }}>
              <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteVacc(row.original)}>
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // DataTable columns for vaccination records
  const recordColumns = [
    { id: "rowNumber", header: "#", cell: ({ row }: any) => row.index + 1 },
    { accessorKey: "patient_name", header: "Patient Name" },
    { accessorKey: "patient_id", header: "Patient ID" },
    { accessorKey: "vaccine_id", header: "Vaccine", cell: ({ row }: any) => {
      const vaccine = vaccinations.find(v => v.id === row.original.vaccine_id);
      return vaccine ? vaccine.name : row.original.vaccine_id;
    }},
    { accessorKey: "facility_id", header: "Facility", cell: ({ row }: any) => {
      const facility = facilities.find(f => f.id === row.original.facility_id);
      return facility ? facility.name : row.original.facility_id;
    }},
    { accessorKey: "date_administered", header: "Date Administered", cell: ({ row }: any) => formatDate(row.original.date_administered) },
    { accessorKey: "dose_number", header: "Dose Number" },
    { accessorKey: "notes", header: "Notes" },
  ];

  return (
    <>
      <Navbar />
      <DistrictAdministratorSidebar />
      <main className="pl-[250px] pr-[20px] pt-20 bg-gray-50 min-h-screen">
        <div className="space-y-6 py-6">
          <div className="flex flex-col items-center space-y-6 max-w-full px-4">
            <div className="flex w-full max-w-6xl justify-between items-center mb-4">
              <div className="bg-white rounded-lg px-6 py-6 w-full">
                <h1 className="text-2xl font-bold text-gray-900">Vaccination Dashboard</h1>
              </div>
            </div>
            {/* Metric Cards */}
            <div className="w-full max-w-6xl">
              <VaccinationMetricCards metrics={metrics} />
            </div>
            <Tabs value={tab} onValueChange={setTab} className="w-full max-w-6xl space-y-4">
              <Card className="h-[70px] w-full flex items-center pl-[30px] justify-between dark:bg-slate-500">
                <TabsList className="w-full flex justify-between items-center">
                  <div>
                    <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
                    <TabsTrigger value="records">Vaccination Records</TabsTrigger>
                  </div>
                </TabsList>
              </Card>
              <Card className="w-full dark:bg-slate-500">
                <TabsContent value="vaccines">
                  <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                    <DialogContent>
                      <DialogTitle>Vaccination Details</DialogTitle>
                      {viewVacc && (
                        <div className="space-y-2 text-black">
                          <div><b>Vaccine:</b> {viewVacc.name}</div>
                          <div><b>Coverage:</b> {viewVacc.coverage}%</div>
                          <div><b>Target:</b> {viewVacc.target}%</div>
                          <div><b>Last Campaign:</b> {viewVacc.last_campaign}</div>
                          <div><b>Expiry Date:</b> {formatDate(viewVacc.expiry_date)}</div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent>
                      <DialogTitle>Edit Vaccination</DialogTitle>
                      {editVacc && (
                        <form className="space-y-4" onSubmit={handleEditVacc}>
                          <input className="w-full border rounded p-2 text-black" placeholder="Vaccine Name" value={editVacc.name} onChange={e => setEditVacc({ ...editVacc, name: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Coverage (%)" type="number" value={editVacc.coverage} onChange={e => setEditVacc({ ...editVacc, coverage: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Target (%)" type="number" value={editVacc.target} onChange={e => setEditVacc({ ...editVacc, target: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Last Campaign Date" type="date" value={editVacc.last_campaign} onChange={e => setEditVacc({ ...editVacc, last_campaign: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Expiry Date" type="date" value={editVacc.expiry_date} onChange={e => setEditVacc({ ...editVacc, expiry_date: e.target.value })} required />
                          <Button type="submit" className="bg-[#137775] text-white">Save</Button>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                  <DataTable columns={vaccColumns} data={vaccinations} userType="sectorCoordinator" initialLoading={loading} />
                </TabsContent>
                <TabsContent value="records">
                  <DataTable columns={recordColumns} data={vaccinationRecords} userType="sectorCoordinator" initialLoading={recordsLoading} />
                </TabsContent>
              </Card>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  );
};

export default Vaccination; 