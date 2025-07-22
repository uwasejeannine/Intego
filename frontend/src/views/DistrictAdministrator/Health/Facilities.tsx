import React, { useEffect } from "react";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "../Navigation/sidebar-menu";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Building2, Users, Clock, Phone } from "lucide-react";
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
  const [hospitals, setHospitals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedHospital, setSelectedHospital] = React.useState<any>(null);

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
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <DistrictAdministratorSidebar />
      <main className="pl-[250px] pr-[20px] pt-20 bg-gray-50 min-h-screen">
        <div className="space-y-6 py-6">
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
      </main>
    </>
  );
};
export default Facilities;