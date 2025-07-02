import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { HeartPulse, AlertTriangle, Users, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/tables/farmers/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Diseases: React.FC = () => {
  const [tab, setTab] = useState("diseases");
  const [diseases, setDiseases] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDisease, setViewDisease] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editDisease, setEditDisease] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newDisease, setNewDisease] = useState({ name: "", available_at: "", consultation_fee: "", referral_required: false });
  
  // Conditions state
  const [viewCondition, setViewCondition] = useState<any>(null);
  const [viewConditionOpen, setViewConditionOpen] = useState(false);
  const [editCondition, setEditCondition] = useState<any>(null);
  const [editConditionOpen, setEditConditionOpen] = useState(false);
  const [addConditionOpen, setAddConditionOpen] = useState(false);
  const [newCondition, setNewCondition] = useState({ name: "", available_at: "", consultation_fee: "", referral_required: false });

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

  const handleAddDisease = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/v1/diseases', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newDisease,
        consultation_fee: Number(newDisease.consultation_fee),
      })
    });
    if (res.ok) {
      const created = await res.json();
      setDiseases([...diseases, created]);
      setAddOpen(false);
      setNewDisease({ name: "", available_at: "", consultation_fee: "", referral_required: false });
    }
  };

  const handleAddCondition = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API call - replace with actual endpoint
    const newConditionData = {
      ...newCondition,
      consultation_fee: Number(newCondition.consultation_fee),
    };
    setConditions([...conditions, { ...newConditionData, id: Date.now() }]);
    setAddConditionOpen(false);
    setNewCondition({ name: "", available_at: "", consultation_fee: "", referral_required: false });
  };

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
            <DropdownMenuItem onClick={() => { setEditDisease(row.original); setEditOpen(true); }}>
              <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
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
            <DropdownMenuItem onClick={() => { setEditCondition(row.original); setEditConditionOpen(true); }}>
              <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
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
                  <div className="flex justify-items-end">
                    {tab === "diseases" && (
                      <Dialog open={addOpen} onOpenChange={setAddOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#137775] text-white">Add Disease</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Add New Disease</DialogTitle>
                          <form className="space-y-4" onSubmit={handleAddDisease}>
                            <input className="w-full border rounded p-2 text-black" placeholder="Disease Name" value={newDisease.name} onChange={e => setNewDisease({ ...newDisease, name: e.target.value })} required />
                            <input className="w-full border rounded p-2 text-black" placeholder="Available At" value={newDisease.available_at} onChange={e => setNewDisease({ ...newDisease, available_at: e.target.value })} required />
                            <input className="w-full border rounded p-2 text-black" placeholder="Consultation Fee" type="number" value={newDisease.consultation_fee} onChange={e => setNewDisease({ ...newDisease, consultation_fee: e.target.value })} required />
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" checked={!!newDisease.referral_required} onChange={e => setNewDisease({ ...newDisease, referral_required: e.target.checked })} />
                              <label className="text-black">Referral Required</label>
                            </div>
                            <Button type="submit" className="bg-[#137775] text-white">Add</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                    {tab === "conditions" && (
                      <Dialog open={addConditionOpen} onOpenChange={setAddConditionOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#137775] text-white">Add Condition</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Add New Condition</DialogTitle>
                          <form className="space-y-4" onSubmit={handleAddCondition}>
                            <input className="w-full border rounded p-2 text-black" placeholder="Condition Name" value={newCondition.name} onChange={e => setNewCondition({ ...newCondition, name: e.target.value })} required />
                            <input className="w-full border rounded p-2 text-black" placeholder="Available At" value={newCondition.available_at} onChange={e => setNewCondition({ ...newCondition, available_at: e.target.value })} required />
                            <input className="w-full border rounded p-2 text-black" placeholder="Consultation Fee" type="number" value={newCondition.consultation_fee} onChange={e => setNewCondition({ ...newCondition, consultation_fee: e.target.value })} required />
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" checked={!!newCondition.referral_required} onChange={e => setNewCondition({ ...newCondition, referral_required: e.target.checked })} />
                              <label className="text-black">Referral Required</label>
                            </div>
                            <Button type="submit" className="bg-[#137775] text-white">Add</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
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
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent>
                      <DialogTitle>Edit Disease</DialogTitle>
                      {editDisease && (
                        <form className="space-y-4">
                          <input className="w-full border rounded p-2 text-black" placeholder="Disease Name" value={editDisease.name} onChange={e => setEditDisease({ ...editDisease, name: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Available At" value={editDisease.available_at} onChange={e => setEditDisease({ ...editDisease, available_at: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Consultation Fee" type="number" value={editDisease.consultation_fee} onChange={e => setEditDisease({ ...editDisease, consultation_fee: e.target.value })} required />
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" checked={!!editDisease.referral_required} onChange={e => setEditDisease({ ...editDisease, referral_required: e.target.checked })} />
                            <label className="text-black">Referral Required</label>
                          </div>
                          <Button type="submit" className="bg-[#137775] text-white">Save</Button>
                        </form>
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
                  <Dialog open={editConditionOpen} onOpenChange={setEditConditionOpen}>
                    <DialogContent>
                      <DialogTitle>Edit Condition</DialogTitle>
                      {editCondition && (
                        <form className="space-y-4">
                          <input className="w-full border rounded p-2 text-black" placeholder="Condition Name" value={editCondition.name} onChange={e => setEditCondition({ ...editCondition, name: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Available At" value={editCondition.available_at} onChange={e => setEditCondition({ ...editCondition, available_at: e.target.value })} required />
                          <input className="w-full border rounded p-2 text-black" placeholder="Consultation Fee" type="number" value={editCondition.consultation_fee} onChange={e => setEditCondition({ ...editCondition, consultation_fee: e.target.value })} required />
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" checked={!!editCondition.referral_required} onChange={e => setEditCondition({ ...editCondition, referral_required: e.target.checked })} />
                            <label className="text-black">Referral Required</label>
                          </div>
                          <Button type="submit" className="bg-[#137775] text-white">Save</Button>
                        </form>
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