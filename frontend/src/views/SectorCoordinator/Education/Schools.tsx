import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Eye, MoreHorizontal, Pencil, Trash2, Users, MapPin, BookOpen, TrendingDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchSchools, createSchool, updateSchool, deleteSchool } from "@/lib/api/api";

const SchoolMetricCards = ({ data }: { data: any[] }) => {
  const totalSchools = data.length;
  const avgAttendance = data.length
    ? (data.reduce((sum, s) => sum + Number(s.attendance || 0), 0) / data.length).toFixed(1) + "%"
    : "0%";
  const avgDropoutRate = data.length
    ? (data.reduce((sum, s) => sum + Number(s.dropoutRate || 0), 0) / data.length).toFixed(1) + "%"
    : "0%";
  const uniqueLocations = new Set(data.map(s => s.location)).size;
  const metrics = [
    { title: "Total Schools", value: totalSchools, icon: BookOpen, color: "#137775", bg: "bg-[#137775]" },
    { title: "Avg. Attendance", value: avgAttendance, icon: Users, color: "#099773", bg: "bg-[#099773]" },
    { title: "Dropout Rate", value: avgDropoutRate, icon: TrendingDown, color: "#F89D2D", bg: "bg-[#F89D2D]" },
    { title: "Locations", value: uniqueLocations, icon: MapPin, color: "#e01024", bg: "bg-[#e01024]" },
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

const SchoolsPage: React.FC = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    location: "",
    attendance: "",
    studentsPerClass: "",
    level: "",
    faculties: "",
    dropoutRate: "",
    headTeacher: "",
    contact: "",
    performance: "",
  });

  useEffect(() => {
    setLoading(true);
    fetchSchools()
      .then((schools) => setData(schools))
      .finally(() => setLoading(false));
  }, []);

  const handleView = (row: any) => {
    setSelectedRow(row);
    setOpenView(true);
  };
  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setForm({
      name: row.name || "",
      location: row.location || "",
      attendance: row.attendance || "",
      studentsPerClass: row.studentsPerClass || "",
      level: row.level || "",
      faculties: row.faculties || "",
      dropoutRate: row.dropoutRate || "",
      headTeacher: row.headTeacher || "",
      contact: row.contact || "",
      performance: row.performance || "",
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
      location: "",
      attendance: "",
      studentsPerClass: "",
      level: "",
      faculties: "",
      dropoutRate: "",
      headTeacher: "",
      contact: "",
      performance: "",
    });
    setOpenAdd(true);
  };
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSchool = await createSchool(form);
    setData([...data, newSchool]);
    setOpenAdd(false);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;
    const updated = await updateSchool(selectedRow.id, form);
    setData(data.map((d) => (d.id === selectedRow.id ? updated : d)));
    setOpenEdit(false);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;
    await deleteSchool(selectedRow.id);
    setData(data.filter((d) => d.id !== selectedRow.id));
    setOpenDelete(false);
  };

  const schoolColumns = [
    {
      id: "rowNumber",
      header: "No.",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "name", header: "School Name" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "attendance", header: "Attendance Rate" },
    { accessorKey: "level", header: "School Level" },
    {
      id: "actions",
      header: "Actions",
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
            <div className="bg-white rounded-lg px-6 py-6 w-full flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Schools Management Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Monitor school locations, attendance, performance, and more</p>
              </div>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <SchoolMetricCards data={data} />
          </div>
          <div className="w-full max-w-6xl flex justify-end mb-2">
            <Button className="bg-[#137775]" onClick={handleAdd}>Add School</Button>
          </div>
          <Card className="w-full dark:bg-slate-500">
            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : (
              <DataTable columns={schoolColumns} data={data} userType="sectorCoordinator" initialLoading={false} />
            )}
          </Card>
        </div>
      </main>
      {/* Add Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Add School</DialogTitle>
          <form className="space-y-4" onSubmit={handleAddSubmit}>
            <input name="name" placeholder="School Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="location" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="attendance" placeholder="Attendance Rate" value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="studentsPerClass" placeholder="Students/Class (min/max)" value={form.studentsPerClass} onChange={e => setForm({ ...form, studentsPerClass: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="level" placeholder="School Level" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="faculties" placeholder="Faculties" value={form.faculties} onChange={e => setForm({ ...form, faculties: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="dropoutRate" placeholder="Dropout Rate" value={form.dropoutRate} onChange={e => setForm({ ...form, dropoutRate: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="headTeacher" placeholder="Head Teacher" value={form.headTeacher} onChange={e => setForm({ ...form, headTeacher: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="contact" placeholder="Contact Info" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="performance" placeholder="Performance" value={form.performance} onChange={e => setForm({ ...form, performance: e.target.value })} className="w-full border rounded p-2 text-black" />
            <Button type="submit">Add</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* View Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogTitle>School Details</DialogTitle>
          {selectedRow && (
            <div className="space-y-2 text-black">
              <div><b>Name:</b> {selectedRow.name}</div>
              <div><b>Location:</b> {selectedRow.location}</div>
              <div><b>Attendance:</b> {selectedRow.attendance}</div>
              <div><b>Students/Class (min/max):</b> {selectedRow.studentsPerClass}</div>
              <div><b>School Level:</b> {selectedRow.level}</div>
              <div><b>Faculties:</b> {selectedRow.faculties}</div>
              <div><b>Dropout Rate:</b> {selectedRow.dropoutRate}</div>
              <div><b>Head Teacher:</b> {selectedRow.headTeacher}</div>
              <div><b>Contact Info:</b> {selectedRow.contact}</div>
              <div><b>Performance:</b> {selectedRow.performance}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Edit School</DialogTitle>
          <form className="space-y-4" onSubmit={handleEditSubmit}>
            <input name="name" placeholder="School Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="location" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="attendance" placeholder="Attendance Rate" value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="studentsPerClass" placeholder="Students/Class (min/max)" value={form.studentsPerClass} onChange={e => setForm({ ...form, studentsPerClass: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="level" placeholder="School Level" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="faculties" placeholder="Faculties" value={form.faculties} onChange={e => setForm({ ...form, faculties: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="dropoutRate" placeholder="Dropout Rate" value={form.dropoutRate} onChange={e => setForm({ ...form, dropoutRate: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="headTeacher" placeholder="Head Teacher" value={form.headTeacher} onChange={e => setForm({ ...form, headTeacher: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="contact" placeholder="Contact Info" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="performance" placeholder="Performance" value={form.performance} onChange={e => setForm({ ...form, performance: e.target.value })} className="w-full border rounded p-2 text-black" />
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogTitle>Delete School</DialogTitle>
          <div className="text-black">Are you sure you want to delete <b>{selectedRow?.name}</b>?</div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button className="bg-red-600 text-white" onClick={handleDeleteConfirm}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SchoolsPage; 