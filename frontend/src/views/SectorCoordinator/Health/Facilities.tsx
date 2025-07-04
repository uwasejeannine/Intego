import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Pencil, Trash2, Building2, Users, Clock, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/tables/farmers/data-table";

const API_URL = "/api/v1/hospital";

const Facilities: React.FC = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [editHospital, setEditHospital] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const initialHospitalState = {
    facility_name: "",
    facility_code: "",
    facility_type: "",
    ownership_type: "",
    region_id: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    gps: "",
    contact_line: "",
    phone: "",
    email: "",
    website: "",
    working_hours: "",
    is_247: false,
    doctors: "",
    nurses: "",
    medical_assistants: "",
    support_staff: "",
    total_staff: "",
    languages: "",
    maternity_ward: false,
    surgery_block: false,
    laboratory: false,
    pharmacy: false,
    emergency_room: false,
    ambulance: false,
    icu: false,
    radiology: false,
    dialysis: false,
    general_consultation: false,
    specialized_services: false,
    diagnostic_services: false,
    family_planning: false,
    vaccination: false,
    general_consultation_fee: "",
    specialized_consultation_fee: "",
    treatment_costs: "",
    payment_methods: "",
    referral_required: false,
    surgery_available: false,
    dialysis_available: false,
    cancer_services: false,
    mental_health_services: false,
    bed_capacity: "",
    current_occupancy: "",
    monthly_patient_capacity: "",
    average_monthly_patients: "",
    last_inspection_date: "",
    accreditation_status: "",
    license_number: "",
    license_expiry_date: "",
    director_name: "",
    director_phone: "",
    director_email: "",
    emergency_preparedness_level: "",
    is_active: true,
    notes: ""
  };
  const [newHospital, setNewHospital] = useState(initialHospitalState);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setHospitals(Array.isArray(data) ? data : data.data || []))
      .finally(() => setLoading(false));
  }, []);

  // Metrics
  const totalHospitals = hospitals.length;
  const totalDoctors = hospitals.reduce((sum, h) => sum + (h.doctors || 0), 0);
  const total247 = hospitals.filter(h => h.is_247 || h.is247 || h["24_7"]).length;
  const totalContacts = hospitals.filter(h => h.contact_line).length;

  const metrics = [
    { title: "Total Hospitals", value: totalHospitals, icon: Building2, color: "#137775" },
    { title: "24/7 Facilities", value: total247, icon: Clock, color: "#099773" },
    { title: "Doctors", value: totalDoctors, icon: Users, color: "#ef8f20" },
    { title: "Contact Lines", value: totalContacts, icon: Phone, color: "#144c49" },
  ];

  // DataTable columns
  const facilityColumns = [
    {
      id: "rowNumber",
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "facility_name", header: "Name" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "facility_type", header: "Level" },
    { accessorKey: "doctors", header: "Doctors" },
    { accessorKey: "contact_line", header: "Contact" },
    {
      accessorKey: "is_247",
      header: "24/7",
      cell: ({ row }: any) => (row.original.is_247 || row.original.is247 || row.original["24_7"]) ? "Yes" : "No",
    },
    { accessorKey: "languages", header: "Languages" },
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
            <DropdownMenuItem onClick={() => { setSelectedHospital(row.original); setViewOpen(true); }}>
              <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setEditHospital(row.original); setEditOpen(true); }}>
              <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original)}>
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleDelete = async (hospital: any) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      // Implement delete logic here
      // await fetch(`${API_URL}/${hospital.id}`, { method: "DELETE" });
      setHospitals(hospitals.filter(h => h.id !== hospital.id));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Implement update logic here
    setEditOpen(false);
    setEditHospital(null);
    setSubmitting(false);
  };

  const handleAddHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newHospital,
        doctors: Number(newHospital.doctors)
      })
    });
    if (res.ok) {
      const created = await res.json();
      setHospitals([...hospitals, created]);
      setAddOpen(false);
      setNewHospital(initialHospitalState);
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
              <h1 className="text-2xl font-bold text-gray-900">Facilities Management Dashboard</h1>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl shadow-lg border min-h-[120px] p-4 flex flex-col items-start">
                    <div className="p-2 rounded-xl mb-2" style={{ background: metric.color }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">{metric.title}</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</div>
                  </div>
                );
              })}
            </div>
            {/* Add Hospital Button */}
            <div className="flex justify-end mb-4">
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#137775] text-white">Add Hospital</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogTitle>Add New Hospital</DialogTitle>
                  <form className="space-y-4" onSubmit={handleAddHospital}>
                    <input className="w-full border rounded p-2 text-black" placeholder="Facility Name" value={newHospital.facility_name} onChange={e => setNewHospital({ ...newHospital, facility_name: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Facility Code" value={newHospital.facility_code} onChange={e => setNewHospital({ ...newHospital, facility_code: e.target.value })} required />
                    <select className="w-full border rounded p-2 text-black" value={newHospital.facility_type} onChange={e => setNewHospital({ ...newHospital, facility_type: e.target.value })} required>
                      <option value="">Select Level</option>
                      <option value="hospital">Hospital</option>
                      <option value="health_center">Health Center</option>
                      <option value="health_post">Health Post</option>
                      <option value="clinic">Clinic</option>
                      <option value="dispensary">Dispensary</option>
                    </select>
                    <select className="w-full border rounded p-2 text-black" value={newHospital.ownership_type} onChange={e => setNewHospital({ ...newHospital, ownership_type: e.target.value })} required>
                      <option value="">Select Ownership</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="faith_based">Faith-based</option>
                      <option value="ngo">NGO</option>
                      <option value="cooperative">Cooperative</option>
                    </select>
                    <input className="w-full border rounded p-2 text-black" placeholder="Region ID" value={newHospital.region_id} onChange={e => setNewHospital({ ...newHospital, region_id: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Province" value={newHospital.province} onChange={e => setNewHospital({ ...newHospital, province: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="District" value={newHospital.district} onChange={e => setNewHospital({ ...newHospital, district: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Sector" value={newHospital.sector} onChange={e => setNewHospital({ ...newHospital, sector: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Cell" value={newHospital.cell} onChange={e => setNewHospital({ ...newHospital, cell: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="GPS Coordinates" value={newHospital.gps} onChange={e => setNewHospital({ ...newHospital, gps: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Contact Line" value={newHospital.contact_line} onChange={e => setNewHospital({ ...newHospital, contact_line: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Phone" value={newHospital.phone} onChange={e => setNewHospital({ ...newHospital, phone: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Email" value={newHospital.email} onChange={e => setNewHospital({ ...newHospital, email: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Website" value={newHospital.website} onChange={e => setNewHospital({ ...newHospital, website: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Working Hours" value={newHospital.working_hours} onChange={e => setNewHospital({ ...newHospital, working_hours: e.target.value })} required />
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.is_247} onChange={e => setNewHospital({ ...newHospital, is_247: e.target.checked })} />
                      <label className="text-black">24/7</label>
                    </div>
                    <input className="w-full border rounded p-2 text-black" placeholder="Doctors" type="number" value={newHospital.doctors} onChange={e => setNewHospital({ ...newHospital, doctors: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Nurses" type="number" value={newHospital.nurses} onChange={e => setNewHospital({ ...newHospital, nurses: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Medical Assistants" value={newHospital.medical_assistants} onChange={e => setNewHospital({ ...newHospital, medical_assistants: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Support Staff" value={newHospital.support_staff} onChange={e => setNewHospital({ ...newHospital, support_staff: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Total Staff" value={newHospital.total_staff} onChange={e => setNewHospital({ ...newHospital, total_staff: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Languages" value={newHospital.languages} onChange={e => setNewHospital({ ...newHospital, languages: e.target.value })} required />
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.maternity_ward} onChange={e => setNewHospital({ ...newHospital, maternity_ward: e.target.checked })} />
                      <label className="text-black">Maternity Ward</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.surgery_block} onChange={e => setNewHospital({ ...newHospital, surgery_block: e.target.checked })} />
                      <label className="text-black">Surgery Block</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.laboratory} onChange={e => setNewHospital({ ...newHospital, laboratory: e.target.checked })} />
                      <label className="text-black">Laboratory</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.pharmacy} onChange={e => setNewHospital({ ...newHospital, pharmacy: e.target.checked })} />
                      <label className="text-black">Pharmacy</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.emergency_room} onChange={e => setNewHospital({ ...newHospital, emergency_room: e.target.checked })} />
                      <label className="text-black">Emergency Room</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.ambulance} onChange={e => setNewHospital({ ...newHospital, ambulance: e.target.checked })} />
                      <label className="text-black">Ambulance Services</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.icu} onChange={e => setNewHospital({ ...newHospital, icu: e.target.checked })} />
                      <label className="text-black">Intensive Care Unit</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.radiology} onChange={e => setNewHospital({ ...newHospital, radiology: e.target.checked })} />
                      <label className="text-black">Radiology</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.dialysis} onChange={e => setNewHospital({ ...newHospital, dialysis: e.target.checked })} />
                      <label className="text-black">Dialysis</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.general_consultation} onChange={e => setNewHospital({ ...newHospital, general_consultation: e.target.checked })} />
                      <label className="text-black">General Consultation</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.specialized_services} onChange={e => setNewHospital({ ...newHospital, specialized_services: e.target.checked })} />
                      <label className="text-black">Specialized Services</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.diagnostic_services} onChange={e => setNewHospital({ ...newHospital, diagnostic_services: e.target.checked })} />
                      <label className="text-black">Diagnostic Services</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.family_planning} onChange={e => setNewHospital({ ...newHospital, family_planning: e.target.checked })} />
                      <label className="text-black">Family Planning</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.vaccination} onChange={e => setNewHospital({ ...newHospital, vaccination: e.target.checked })} />
                      <label className="text-black">Vaccination</label>
                    </div>
                    <input className="w-full border rounded p-2 text-black" placeholder="General Consultation Fee" value={newHospital.general_consultation_fee} onChange={e => setNewHospital({ ...newHospital, general_consultation_fee: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Specialized Consultation Fee" value={newHospital.specialized_consultation_fee} onChange={e => setNewHospital({ ...newHospital, specialized_consultation_fee: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Treatment Costs" value={newHospital.treatment_costs} onChange={e => setNewHospital({ ...newHospital, treatment_costs: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Payment Methods" value={newHospital.payment_methods} onChange={e => setNewHospital({ ...newHospital, payment_methods: e.target.value })} />
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.referral_required} onChange={e => setNewHospital({ ...newHospital, referral_required: e.target.checked })} />
                      <label className="text-black">Referral Required</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.surgery_available} onChange={e => setNewHospital({ ...newHospital, surgery_available: e.target.checked })} />
                      <label className="text-black">Surgery Available</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.dialysis_available} onChange={e => setNewHospital({ ...newHospital, dialysis_available: e.target.checked })} />
                      <label className="text-black">Dialysis Provided</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.cancer_services} onChange={e => setNewHospital({ ...newHospital, cancer_services: e.target.checked })} />
                      <label className="text-black">Cancer Services</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.mental_health_services} onChange={e => setNewHospital({ ...newHospital, mental_health_services: e.target.checked })} />
                      <label className="text-black">Mental Health Services</label>
                    </div>
                    <input className="w-full border rounded p-2 text-black" placeholder="Bed Capacity" value={newHospital.bed_capacity} onChange={e => setNewHospital({ ...newHospital, bed_capacity: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Current Occupancy" value={newHospital.current_occupancy} onChange={e => setNewHospital({ ...newHospital, current_occupancy: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Monthly Patient Capacity" value={newHospital.monthly_patient_capacity} onChange={e => setNewHospital({ ...newHospital, monthly_patient_capacity: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Average Monthly Patients" value={newHospital.average_monthly_patients} onChange={e => setNewHospital({ ...newHospital, average_monthly_patients: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Last Inspection Date" value={newHospital.last_inspection_date} onChange={e => setNewHospital({ ...newHospital, last_inspection_date: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Accreditation Status" value={newHospital.accreditation_status} onChange={e => setNewHospital({ ...newHospital, accreditation_status: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="License Number" value={newHospital.license_number} onChange={e => setNewHospital({ ...newHospital, license_number: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="License Expiry Date" value={newHospital.license_expiry_date} onChange={e => setNewHospital({ ...newHospital, license_expiry_date: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Director Name" value={newHospital.director_name} onChange={e => setNewHospital({ ...newHospital, director_name: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Director Phone" value={newHospital.director_phone} onChange={e => setNewHospital({ ...newHospital, director_phone: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Director Email" value={newHospital.director_email} onChange={e => setNewHospital({ ...newHospital, director_email: e.target.value })} />
                    <input className="w-full border rounded p-2 text-black" placeholder="Emergency Preparedness Level" value={newHospital.emergency_preparedness_level} onChange={e => setNewHospital({ ...newHospital, emergency_preparedness_level: e.target.value })} />
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={!!newHospital.is_active} onChange={e => setNewHospital({ ...newHospital, is_active: e.target.checked })} />
                      <label className="text-black">Active</label>
                    </div>
                    <input className="w-full border rounded p-2 text-black" placeholder="Notes" value={newHospital.notes} onChange={e => setNewHospital({ ...newHospital, notes: e.target.value })} />
                    <Button type="submit" className="bg-[#137775] text-white">Add</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Card className="w-full dark:bg-slate-500">
              <DataTable columns={facilityColumns} data={hospitals} userType="sectorCoordinator" initialLoading={loading} />
            </Card>
          </div>
        </div>
        {/* View Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent>
            <DialogTitle>Hospital Details</DialogTitle>
            {selectedHospital && (
              <div className="space-y-4 text-black max-h-[70vh] overflow-y-auto">
                {/* 1. Basic Info */}
                <div>
                  <h2 className="font-bold text-lg mb-1">1. Basic Information</h2>
                  <div><b>Hospital Name:</b> {selectedHospital.facility_name || 'N/A'}</div>
                  <div><b>Hospital Type:</b> {selectedHospital.facility_type || 'N/A'}</div>
                  <div><b>Level:</b> {selectedHospital.facility_type || 'N/A'}</div>
                  <div><b>Ownership:</b> {selectedHospital.ownership_type || 'N/A'}</div>
                </div>
                {/* 2. Location & Contact */}
                <div>
                  <h2 className="font-bold text-lg mb-1">2. Location & Contact</h2>
                  <div><b>Province:</b> {selectedHospital.province || 'N/A'}</div>
                  <div><b>District:</b> {selectedHospital.district || 'N/A'}</div>
                  <div><b>Sector:</b> {selectedHospital.sector || 'N/A'}</div>
                  <div><b>Cell:</b> {selectedHospital.cell || 'N/A'}</div>
                  <div><b>GPS Coordinates:</b> {selectedHospital.gps || 'N/A'}</div>
                  <div><b>Phone Number(s):</b> {selectedHospital.contact_line || selectedHospital.phone || 'N/A'}</div>
                  <div><b>Email / Website:</b> {selectedHospital.email || selectedHospital.website || 'N/A'}</div>
                  <div><b>Operating Hours:</b> {selectedHospital.working_hours || 'N/A'}</div>
                  <div><b>24/7 Availability:</b> {selectedHospital.is_247 ? 'Yes' : 'No'}</div>
                </div>
                {/* 3. Staffing & Capacity */}
                <div>
                  <h2 className="font-bold text-lg mb-1">3. Staffing & Capacity</h2>
                  <div><b>Number of Doctors:</b> {selectedHospital.doctors || 'N/A'}</div>
                  <div><b>Number of Nurses:</b> {selectedHospital.nurses || 'N/A'}</div>
                  <div><b>Specialists Available:</b> {selectedHospital.specialists || 'N/A'}</div>
                  <div><b>Total Staff Count:</b> {selectedHospital.total_staff || 'N/A'}</div>
                  <div><b>Languages Spoken:</b> {selectedHospital.languages || 'N/A'}</div>
                </div>
                {/* 4. Facilities Available */}
                <div>
                  <h2 className="font-bold text-lg mb-1">4. Facilities Available</h2>
                  <div><b>Maternity ward:</b> {selectedHospital.maternity_ward ? 'Yes' : 'No'}</div>
                  <div><b>Surgery block:</b> {selectedHospital.surgery_block ? 'Yes' : 'No'}</div>
                  <div><b>Laboratory:</b> {selectedHospital.laboratory ? 'Yes' : 'No'}</div>
                  <div><b>Pharmacy:</b> {selectedHospital.pharmacy ? 'Yes' : 'No'}</div>
                  <div><b>Emergency Room (ER):</b> {selectedHospital.emergency_room ? 'Yes' : 'No'}</div>
                  <div><b>Ambulance services:</b> {selectedHospital.ambulance ? 'Yes' : 'No'}</div>
                  <div><b>Intensive Care Unit (ICU):</b> {selectedHospital.icu ? 'Yes' : 'No'}</div>
                  <div><b>Radiology / X-ray / Ultrasound:</b> {selectedHospital.radiology ? 'Yes' : 'No'}</div>
                  <div><b>Dialysis unit:</b> {selectedHospital.dialysis ? 'Yes' : 'No'}</div>
                </div>
                {/* 5. Services Offered */}
                <div>
                  <h2 className="font-bold text-lg mb-1">5. Services Offered</h2>
                  <div><b>General Consultation:</b> {selectedHospital.general_consultation ? 'Yes' : 'No'}</div>
                  <div><b>Specialized Services:</b> {selectedHospital.specialized_services ? 'Yes' : 'No'}</div>
                  <div><b>Diagnostic Services:</b> {selectedHospital.diagnostic_services ? 'Yes' : 'No'}</div>
                  <div><b>Family Planning:</b> {selectedHospital.family_planning ? 'Yes' : 'No'}</div>
                  <div><b>Vaccination:</b> {selectedHospital.vaccination ? 'Yes' : 'No'}</div>
                </div>
                {/* 6. Cost & Payment */}
                <div>
                  <h2 className="font-bold text-lg mb-1">6. Cost & Payment</h2>
                  <div><b>Consultation Fees (General):</b> {selectedHospital.general_consultation_fee || 'N/A'}</div>
                  <div><b>Consultation Fees (Specialized):</b> {selectedHospital.specialized_consultation_fee || 'N/A'}</div>
                  <div><b>Treatment Costs:</b> {selectedHospital.treatment_costs || 'N/A'}</div>
                  <div><b>Accepted Payment Methods:</b> {selectedHospital.payment_methods || 'N/A'}</div>
                  <div><b>Referral Required:</b> {selectedHospital.referral_required ? 'Yes' : 'No'}</div>
                </div>
                {/* 7. Availability of Specialized Treatment */}
                <div>
                  <h2 className="font-bold text-lg mb-1">7. Availability of Specialized Treatment</h2>
                  <div><b>Surgery available:</b> {selectedHospital.surgery_available ? 'Yes' : 'No'}</div>
                  <div><b>Dialysis provided:</b> {selectedHospital.dialysis_available ? 'Yes' : 'No'}</div>
                  <div><b>Cancer services offered:</b> {selectedHospital.cancer_services ? 'Yes' : 'No'}</div>
                  <div><b>Mental health services:</b> {selectedHospital.mental_health_services ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogTitle>Edit Hospital</DialogTitle>
            {editHospital && (
              <form className="space-y-4" onSubmit={handleEditSubmit}>
                <input className="w-full border rounded p-2 text-black" placeholder="Name" value={editHospital.facility_name || ''} onChange={e => setEditHospital({ ...editHospital, facility_name: e.target.value })} required />
                <input className="w-full border rounded p-2 text-black" placeholder="Location" value={editHospital.location || ''} onChange={e => setEditHospital({ ...editHospital, location: e.target.value })} required />
                <input className="w-full border rounded p-2 text-black" placeholder="Level" value={editHospital.facility_type || ''} onChange={e => setEditHospital({ ...editHospital, facility_type: e.target.value })} required />
                <input className="w-full border rounded p-2 text-black" placeholder="Doctors" value={editHospital.doctors || ''} onChange={e => setEditHospital({ ...editHospital, doctors: e.target.value })} required />
                <input className="w-full border rounded p-2 text-black" placeholder="Contact" value={editHospital.contact_line || ''} onChange={e => setEditHospital({ ...editHospital, contact_line: e.target.value })} required />
                <input className="w-full border rounded p-2 text-black" placeholder="Languages" value={editHospital.languages || ''} onChange={e => setEditHospital({ ...editHospital, languages: e.target.value })} required />
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={!!editHospital.is_247} onChange={e => setEditHospital({ ...editHospital, is_247: e.target.checked })} />
                  <label className="text-black">24/7</label>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};
export default Facilities;