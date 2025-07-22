import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "../Navigation/sidebar-menu";
import { HeartPulse, AlertTriangle, Users, MoreHorizontal, Eye} from "lucide-react";
import { DataTable } from "@/components/tables/farmers/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Diseases: React.FC = () => {
  const [tab, setTab] = useState("diseases");
  const [diseases, setDiseases] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDisease, setViewDisease] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  
  // Conditions state
  const [viewCondition, setViewCondition] = useState<any>(null);
  const [viewConditionOpen, setViewConditionOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/diseases')
      .then(res => res.json())
      .then(data => setDiseases(Array.isArray(data) ? data : data.data || []))
      .finally(() => setLoading(false));
    
    // Mock conditions data - replace with actual API call
    setConditions([
      { name: "Hypertension", available_at: "All Hospitals", consultation_fee: 5000, referral_required: false },
      { name: "Diabetes", available_at: "District+ Hospitals", consultation_fee: 8000, referral_required: false },
      { name: "Asthma", available_at: "All Hospitals", consultation_fee: 3000, referral_required: false },
    ]);
  }, []);


  // Metrics
  const totalDiseases = diseases.length;
  const referralRequired = diseases.filter(d => d.referral_required).length;
  const mostExpensive = diseases.reduce((max, d) => d.consultation_fee > (max?.consultation_fee || 0) ? d : max, {});

  const metrics = [
    { title: "Total Diseases", value: totalDiseases, icon: HeartPulse, color: "#ef8f20" },
    { title: "Referral Required", value: referralRequired, icon: AlertTriangle, color: "#137775" },
    { title: "Most Expensive", value: mostExpensive?.name ? `${mostExpensive.name} (${mostExpensive.consultation_fee} RWF)` : "-", icon: Users, color: "#099773" },
  ];

  // DataTable columns for diseases
  const diseaseColumns = [
    {
      id: "rowNumber",
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "name", header: "Disease" },
    { accessorKey: "available_at", header: "Available At" },
    { accessorKey: "consultation_fee", header: "Consultation Fee" },
    {
      accessorKey: "referral_required",
      header: "Referral Required",
      cell: ({ row }: any) => row.original.referral_required ? "Yes" : "No",
    },
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
            <DropdownMenuItem onClick={() => { setViewDisease(row.original); setViewOpen(true); }}>
              <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // DataTable columns for conditions
  const conditionColumns = [
    {
      id: "rowNumber",
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "name", header: "Condition" },
    { accessorKey: "available_at", header: "Available At" },
    { accessorKey: "consultation_fee", header: "Consultation Fee" },
    {
      accessorKey: "referral_required",
      header: "Referral Required",
      cell: ({ row }: any) => row.original.referral_required ? "Yes" : "No",
    },
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
            <DropdownMenuItem onClick={() => { setViewCondition(row.original); setViewConditionOpen(true); }}>
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
              <h1 className="text-2xl font-bold text-gray-900">Diseases & Conditions Dashboard</h1>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            <Tabs value={tab} onValueChange={setTab} className="w-full max-w-6xl space-y-4">
              <Card className="h-[70px] w-full flex items-center pl-[30px] justify-between dark:bg-slate-500">
                <TabsList className="w-full flex justify-between items-center">
                  <div>
                    <TabsTrigger value="diseases">Diseases</TabsTrigger>
                    <TabsTrigger value="conditions">Conditions</TabsTrigger>
                  </div>
                </TabsList>
              </Card>
              <Card className="w-full dark:bg-slate-500">
                <TabsContent value="diseases">
                  <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                    <DialogContent>
                      <DialogTitle>Disease Details</DialogTitle>
                      {viewDisease && (
                        <div className="space-y-2 text-black">
                          <div><b>Disease:</b> {viewDisease.name}</div>
                          <div><b>Available At:</b> {viewDisease.available_at}</div>
                          <div><b>Consultation Fee:</b> {viewDisease.consultation_fee}</div>
                          <div><b>Referral Required:</b> {viewDisease.referral_required ? "Yes" : "No"}</div>
                          {viewDisease.symptoms && <div><b>Symptoms:</b> {Array.isArray(viewDisease.symptoms) ? viewDisease.symptoms.join(", ") : viewDisease.symptoms}</div>}
                          {viewDisease.treatment && <div><b>Treatment:</b> {viewDisease.treatment}</div>}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <DataTable columns={diseaseColumns} data={diseases} userType="sectorCoordinator" initialLoading={loading} />
                </TabsContent>
                <TabsContent value="conditions">
                  <Dialog open={viewConditionOpen} onOpenChange={setViewConditionOpen}>
                    <DialogContent>
                      <DialogTitle>Condition Details</DialogTitle>
                      {viewCondition && (
                        <div className="space-y-2 text-black">
                          <div><b>Condition:</b> {viewCondition.name}</div>
                          <div><b>Available At:</b> {viewCondition.available_at}</div>
                          <div><b>Consultation Fee:</b> {viewCondition.consultation_fee}</div>
                          <div><b>Referral Required:</b> {viewCondition.referral_required ? "Yes" : "No"}</div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <DataTable columns={conditionColumns} data={conditions} userType="sectorCoordinator" initialLoading={false} />
                </TabsContent>
              </Card>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  );
};
export default Diseases; 