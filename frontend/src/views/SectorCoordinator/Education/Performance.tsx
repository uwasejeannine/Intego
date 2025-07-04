import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { BookOpen, TrendingDown, Users, Calendar, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { fetchPerformances, createPerformance, updatePerformance, deletePerformance } from "@/lib/api/api";

const perfColumns = [
  {
    id: "rowNumber",
    header: "No.",
    cell: ({ row }: any) => row.index + 1,
  },
  { accessorKey: "school", header: "School" },
  { accessorKey: "exam", header: "Exam" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "passRate", header: "Pass Rate" },
  {
    id: "actions",
    header: "Actions",
    cell: ({}: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => {/* handleView(row.original) */}}>
            <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {/* handleEdit(row.original) */}}>
            <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {/* handleDelete(row.original) */}}>
            <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const PerfMetricCards = ({ data }: { data: any[] }) => {
  const totalSchools = new Set(data.map(p => p.school)).size;
  const avgPassRate = data.length
    ? (data.reduce((sum, p) => sum + parseFloat((p.passRate || '0').toString()), 0) / data.length).toFixed(1) + "%"
    : "0%";
  const lowPerforming = data.filter(p => (p.lowPerforming || '').toLowerCase() === 'yes' || (p.lowPerforming || '').toLowerCase() === 'true').length;
  const districts = new Set(data.map(p => p.district)).size;
  const metrics = [
    { title: "Schools", value: totalSchools, icon: BookOpen, color: "#137775", bg: "bg-[#137775]" },
    { title: "Avg. Pass Rate", value: avgPassRate, icon: Calendar, color: "#099773", bg: "bg-[#099773]" },
    { title: "Low-Performing", value: lowPerforming, icon: TrendingDown, color: "#F89D2D", bg: "bg-[#F89D2D]" },
    { title: "Districts", value: districts, icon: Users, color: "#e01024", bg: "bg-[#e01024]" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        return (
          <div key={i} className="bg-white rounded-2xl shadow-lg border min-h-[120px] p-4 flex flex-col items-start">
            <div className={`p-2 rounded-xl mb-2`} style={{ background: metric.color }}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">{metric.title}</h3>
            <div className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</div>
          </div>
        );
      })}
    </div>
  );
};

const PerformancePage: React.FC = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    school: "",
    exam: "",
    subject: "",
    passRate: "",
    nationalAvg: "",
    literacy: "",
    numeracy: "",
    trend: "",
    lowPerforming: "",
    district: "",
  });

  useEffect(() => {
    setLoading(true);
    fetchPerformances()
      .then((performances) => setData(performances))
      .finally(() => setLoading(false));
  }, []);

  const handleView = (row: any) => {
    setSelectedRow(row);
    setOpenView(true);
  };
  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setForm({
      school: row.school || "",
      exam: row.exam || "",
      subject: row.subject || "",
      passRate: row.passRate || "",
      nationalAvg: row.nationalAvg || "",
      literacy: row.literacy || "",
      numeracy: row.numeracy || "",
      trend: row.trend || "",
      lowPerforming: row.lowPerforming || "",
      district: row.district || "",
    });
    setOpenEdit(true);
  };
  const handleDelete = (row: any) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };
  const handleAdd = () => {
    setForm({
      school: "",
      exam: "",
      subject: "",
      passRate: "",
      nationalAvg: "",
      literacy: "",
      numeracy: "",
      trend: "",
      lowPerforming: "",
      district: "",
    });
    setOpenAdd(true);
  };
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPerformance = await createPerformance(form);
    setData([...data, newPerformance]);
    setOpenAdd(false);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;
    const updated = await updatePerformance(selectedRow.id, form);
    setData(data.map((d) => (d.id === selectedRow.id ? updated : d)));
    setOpenEdit(false);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;
    await deletePerformance(selectedRow.id);
    setData(data.filter((d) => d.id !== selectedRow.id));
    setOpenDelete(false);
  };

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24 min-h-screen">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          <div className="flex w-full max-w-6xl justify-between items-center mb-4">
            <div className="bg-white rounded-lg px-6 py-6 w-full">
              <h1 className="text-2xl font-bold text-gray-900">Performance & Exams Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Track exam results, literacy, numeracy, and more</p>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <PerfMetricCards data={data} />
          </div>
          <div className="w-full max-w-6xl flex justify-end mb-2">
            <Button className="bg-[#137775]" onClick={handleAdd}>Add Performance</Button>
          </div>
          <Card className="w-full dark:bg-slate-500">
            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : (
              <DataTable columns={perfColumns.map(col =>
                col.id === 'actions' ? {
                  ...col,
                  cell: ({ row }: any) => (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
                          <MoreHorizontal className="w-5 h-5" />
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
                  )
                } : col
              )} data={data} userType="sectorCoordinator" initialLoading={false} />
            )}
          </Card>
        </div>
      </main>
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Add Performance</DialogTitle>
          <form className="space-y-4" onSubmit={handleAddSubmit}>
            <input name="school" placeholder="School" className="w-full border rounded p-2 text-black" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} />
            <input name="exam" placeholder="Exam" className="w-full border rounded p-2 text-black" value={form.exam} onChange={e => setForm({ ...form, exam: e.target.value })} />
            <input name="subject" placeholder="Subject" className="w-full border rounded p-2 text-black" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <input name="passRate" placeholder="Pass Rate" className="w-full border rounded p-2 text-black" value={form.passRate} onChange={e => setForm({ ...form, passRate: e.target.value })} />
            <input name="nationalAvg" placeholder="National Avg" className="w-full border rounded p-2 text-black" value={form.nationalAvg} onChange={e => setForm({ ...form, nationalAvg: e.target.value })} />
            <input name="literacy" placeholder="Literacy" className="w-full border rounded p-2 text-black" value={form.literacy} onChange={e => setForm({ ...form, literacy: e.target.value })} />
            <input name="numeracy" placeholder="Numeracy" className="w-full border rounded p-2 text-black" value={form.numeracy} onChange={e => setForm({ ...form, numeracy: e.target.value })} />
            <input name="trend" placeholder="Trend" className="w-full border rounded p-2 text-black" value={form.trend} onChange={e => setForm({ ...form, trend: e.target.value })} />
            <input name="lowPerforming" placeholder="Low Performing" className="w-full border rounded p-2 text-black" value={form.lowPerforming} onChange={e => setForm({ ...form, lowPerforming: e.target.value })} />
            <input name="district" placeholder="District" className="w-full border rounded p-2 text-black" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} />
            <Button type="submit">Add</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Edit Performance</DialogTitle>
          <form className="space-y-4" onSubmit={handleEditSubmit}>
            <input name="school" placeholder="School" className="w-full border rounded p-2 text-black" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} />
            <input name="exam" placeholder="Exam" className="w-full border rounded p-2 text-black" value={form.exam} onChange={e => setForm({ ...form, exam: e.target.value })} />
            <input name="subject" placeholder="Subject" className="w-full border rounded p-2 text-black" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <input name="passRate" placeholder="Pass Rate" className="w-full border rounded p-2 text-black" value={form.passRate} onChange={e => setForm({ ...form, passRate: e.target.value })} />
            <input name="nationalAvg" placeholder="National Avg" className="w-full border rounded p-2 text-black" value={form.nationalAvg} onChange={e => setForm({ ...form, nationalAvg: e.target.value })} />
            <input name="literacy" placeholder="Literacy" className="w-full border rounded p-2 text-black" value={form.literacy} onChange={e => setForm({ ...form, literacy: e.target.value })} />
            <input name="numeracy" placeholder="Numeracy" className="w-full border rounded p-2 text-black" value={form.numeracy} onChange={e => setForm({ ...form, numeracy: e.target.value })} />
            <input name="trend" placeholder="Trend" className="w-full border rounded p-2 text-black" value={form.trend} onChange={e => setForm({ ...form, trend: e.target.value })} />
            <input name="lowPerforming" placeholder="Low Performing" className="w-full border rounded p-2 text-black" value={form.lowPerforming} onChange={e => setForm({ ...form, lowPerforming: e.target.value })} />
            <input name="district" placeholder="District" className="w-full border rounded p-2 text-black" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} />
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogTitle>Delete Performance</DialogTitle>
          <div className="mb-4">Are you sure you want to delete this performance record?</div>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Performance Details</DialogTitle>
          {selectedRow && (
            <div className="space-y-2 text-black">
              <div><b>School:</b> {selectedRow.school}</div>
              <div><b>Exam:</b> {selectedRow.exam}</div>
              <div><b>Subject:</b> {selectedRow.subject}</div>
              <div><b>Pass Rate:</b> {selectedRow.passRate}</div>
              <div><b>National Avg:</b> {selectedRow.nationalAvg}</div>
              <div><b>Literacy:</b> {selectedRow.literacy}</div>
              <div><b>Numeracy:</b> {selectedRow.numeracy}</div>
              <div><b>Trend:</b> {selectedRow.trend}</div>
              <div><b>Low Performing:</b> {selectedRow.lowPerforming}</div>
              <div><b>District:</b> {selectedRow.district}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PerformancePage; 