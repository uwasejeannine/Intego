import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { TrendingDown, Users, Calendar, Phone, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { fetchDropouts, createDropout, updateDropout, deleteDropout } from "@/lib/api/api";

const DropoutsPage: React.FC = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    school: "",
    grade: "",
    gender: "",
    reason: "",
    earlyWarning: "",
    pregnancy: "",
    reintegration: "",
    absenteeism: "",
    contact: "",
  });

  const handleView = (row: any) => {
    setSelectedRow(row);
    setOpenView(true);
  };
  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setForm({
      name: row.name || "",
      school: row.school || "",
      grade: row.grade || "",
      gender: row.gender || "",
      reason: row.reason || "",
      earlyWarning: row.earlyWarning || "",
      pregnancy: row.pregnancy || "",
      reintegration: row.reintegration || "",
      absenteeism: row.absenteeism || "",
      contact: row.contact || "",
    });
    setOpenEdit(true);
  };
  const handleDelete = (row: any) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };
  const handleAdd = () => {
    setForm({
      name: "",
      school: "",
      grade: "",
      gender: "",
      reason: "",
      earlyWarning: "",
      pregnancy: "",
      reintegration: "",
      absenteeism: "",
      contact: "",
    });
    setOpenAdd(true);
  };
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDropout = await createDropout(form);
    setData([...data, newDropout]);
    setOpenAdd(false);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;
    const updated = await updateDropout(selectedRow.id, form);
    setData(data.map((d) => (d.id === selectedRow.id ? updated : d)));
    setOpenEdit(false);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;
    await deleteDropout(selectedRow.id);
    setData(data.filter((d) => d.id !== selectedRow.id));
    setOpenDelete(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchDropouts()
      .then((dropouts) => setData(dropouts))
      .finally(() => setLoading(false));
  }, []);

  const dropoutColumns = [
    {
      id: "rowNumber",
      header: "No.",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "school", header: "School" },
    { accessorKey: "grade", header: "Grade" },
    { accessorKey: "reason", header: "Reason" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
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
      ),
    },
  ];

  const DropoutMetricCards = ({ data }: { data: any[] }) => {
    const totalDropouts = data.length;
    const pregnancyCases = data.filter(d => d.reason && d.reason.toLowerCase().includes('pregnan')).length;
    const reintegrated = data.filter(d => d.reintegration && d.reintegration.toLowerCase() === 'yes').length;
    const earlyWarnings = data.filter(d => d.earlyWarning && d.earlyWarning.toLowerCase() === 'yes').length;
    const metrics = [
      { title: "Total Dropouts", value: totalDropouts, icon: TrendingDown, color: "#137775", bg: "bg-[#137775]" },
      { title: "Pregnancy Cases", value: pregnancyCases, icon: Calendar, color: "#099773", bg: "bg-[#099773]" },
      { title: "Reintegrated", value: reintegrated, icon: Users, color: "#F89D2D", bg: "bg-[#F89D2D]" },
      { title: "Early Warnings", value: earlyWarnings, icon: Phone, color: "#e01024", bg: "bg-[#e01024]" },
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

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24 min-h-screen">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          <div className="flex w-full max-w-6xl justify-between items-center mb-4">
            <div className="bg-white rounded-lg px-6 py-6 w-full">
              <h1 className="text-2xl font-bold text-gray-900">Dropouts & At-Risk Students Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Monitor dropouts, early warnings, reintegration, and more</p>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <DropoutMetricCards data={data} />
          </div>
          <div className="w-full max-w-6xl flex justify-end mb-2">
            <Button className="bg-[#137775]" onClick={handleAdd}>Add Dropout</Button>
          </div>
          <Card className="w-full dark:bg-slate-500">
            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : (
              <DataTable columns={dropoutColumns} data={data} userType="sectorCoordinator" initialLoading={false} />
            )}
          </Card>
        </div>
      </main>
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogTitle>Add Dropout</DialogTitle>
          <form className="space-y-4" onSubmit={handleAddSubmit}>
            <input name="name" placeholder="Name" className="w-full border rounded p-2 text-black" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input name="school" placeholder="School" className="w-full border rounded p-2 text-black" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
            <input name="grade" placeholder="Grade" className="w-full border rounded p-2 text-black" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
            <input name="gender" placeholder="Gender" className="w-full border rounded p-2 text-black" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
            <input name="reason" placeholder="Reason" className="w-full border rounded p-2 text-black" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            <Button type="submit">Add</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogTitle>Dropout Details</DialogTitle>
          {selectedRow && (
            <div className="space-y-2 text-black">
              <div><b>Name:</b> {selectedRow.name}</div>
              <div><b>School:</b> {selectedRow.school}</div>
              <div><b>Grade:</b> {selectedRow.grade}</div>
              <div><b>Gender:</b> {selectedRow.gender}</div>
              <div><b>Reason:</b> {selectedRow.reason}</div>
              <div><b>Early Warning:</b> {selectedRow.earlyWarning}</div>
              <div><b>Pregnancy:</b> {selectedRow.pregnancy}</div>
              <div><b>Reintegration:</b> {selectedRow.reintegration}</div>
              <div><b>Absenteeism:</b> {selectedRow.absenteeism}</div>
              <div><b>Contact:</b> {selectedRow.contact}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogTitle>Edit Dropout</DialogTitle>
          <form className="space-y-4" onSubmit={handleEditSubmit}>
            <input name="name" placeholder="Name" className="w-full border rounded p-2 text-black" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input name="school" placeholder="School" className="w-full border rounded p-2 text-black" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
            <input name="grade" placeholder="Grade" className="w-full border rounded p-2 text-black" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
            <input name="gender" placeholder="Gender" className="w-full border rounded p-2 text-black" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
            <input name="reason" placeholder="Reason" className="w-full border rounded p-2 text-black" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogTitle>Delete Dropout</DialogTitle>
          <p>Are you sure you want to delete this dropout?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DropoutsPage; 