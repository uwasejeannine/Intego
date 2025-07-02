import React, { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Navbar } from "@/components/navigation/main-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/tables/farmers/data-table";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { Users, Calendar, Heart, TrendingDown } from "lucide-react";
import { fetchStudents, createStudent, updateStudent, deleteStudent } from "@/lib/api/api";

const StudentMetricCards = ({ data }: { data: any[] }) => {
  const totalStudents = data.length;
  const avgAttendance = data.length
    ? (data.reduce((sum, s) => sum + Number(s.attendance || 0), 0) / data.length).toFixed(1) + "%"
    : "0%";
  const disabilityInclusion = data.filter(s => s.disability && s.disability !== "No").length;
  const ovcCount = data.filter(s => s.ovc && s.ovc !== "No").length;
  const metrics = [
    { title: "Total Students", value: totalStudents, icon: Users, color: "#137775", bg: "bg-[#137775]" },
    { title: "Avg. Attendance", value: avgAttendance, icon: Calendar, color: "#099773", bg: "bg-[#099773]" },
    { title: "Disability Inclusion", value: disabilityInclusion, icon: Heart, color: "#F89D2D", bg: "bg-[#F89D2D]" },
    { title: "OVC", value: ovcCount, icon: TrendingDown, color: "#e01024", bg: "bg-[#e01024]" },
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

const StudentsPage: React.FC = () => {
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
    gender: "",
    age: "",
    enrollment: "",
    attendance: "",
    disability: "",
    ovc: "",
    transfers: "",
    health: "",
    class: "",
    contact: "",
  });

  useEffect(() => {
    setLoading(true);
    fetchStudents()
      .then((students) => setData(students))
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
      school: row.school || "",
      gender: row.gender || "",
      age: row.age || "",
      enrollment: row.enrollment || "",
      attendance: row.attendance || "",
      disability: row.disability || "",
      ovc: row.ovc || "",
      transfers: row.transfers || "",
      health: row.health || "",
      class: row.class || "",
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
      gender: "",
      age: "",
      enrollment: "",
      attendance: "",
      disability: "",
      ovc: "",
      transfers: "",
      health: "",
      class: "",
      contact: "",
    });
    setOpenAdd(true);
  };
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent = await createStudent(form);
    setData([...data, newStudent]);
    setOpenAdd(false);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;
    const updated = await updateStudent(selectedRow.id, form);
    setData(data.map((d) => (d.id === selectedRow.id ? updated : d)));
    setOpenEdit(false);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;
    await deleteStudent(selectedRow.id);
    setData(data.filter((d) => d.id !== selectedRow.id));
    setOpenDelete(false);
  };

  const studentColumns = [
    {
      id: "rowNumber",
      header: "No.",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "school", header: "School" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "attendance", header: "Attendance Rate" },
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
            <div className="bg-white rounded-lg px-6 py-6 w-full">
              <h1 className="text-2xl font-bold text-gray-900">Students Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Track enrollment, attendance, inclusion, and more</p>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <StudentMetricCards data={data} />
          </div>
          <div className="w-full max-w-6xl flex justify-end mb-2">
            <Button className="bg-[#137775]" onClick={handleAdd}>Add Student</Button>
          </div>
          <Card className="w-full dark:bg-slate-500">
            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : (
              <DataTable columns={studentColumns} data={data} userType="sectorCoordinator" initialLoading={false} />
            )}
          </Card>
        </div>
      </main>
      {/* Add Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Add Student</DialogTitle>
          <form className="space-y-4" onSubmit={handleAddSubmit}>
            <input name="name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="school" placeholder="School" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="gender" placeholder="Gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="age" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="enrollment" placeholder="Enrollment Date" value={form.enrollment} onChange={e => setForm({ ...form, enrollment: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="attendance" placeholder="Attendance Rate" value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="disability" placeholder="Disability" value={form.disability} onChange={e => setForm({ ...form, disability: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="ovc" placeholder="OVC" value={form.ovc} onChange={e => setForm({ ...form, ovc: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="transfers" placeholder="Transfers" value={form.transfers} onChange={e => setForm({ ...form, transfers: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="health" placeholder="Health" value={form.health} onChange={e => setForm({ ...form, health: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="class" placeholder="Class" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="contact" placeholder="Contact Info" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full border rounded p-2 text-black" />
            <Button type="submit">Add</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* View Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogTitle>Student Details</DialogTitle>
          {selectedRow && (
            <div className="space-y-2 text-black">
              <div><b>Name:</b> {selectedRow.name}</div>
              <div><b>School:</b> {selectedRow.school}</div>
              <div><b>Gender:</b> {selectedRow.gender}</div>
              <div><b>Age:</b> {selectedRow.age}</div>
              <div><b>Enrollment Date:</b> {selectedRow.enrollment}</div>
              <div><b>Attendance Rate:</b> {selectedRow.attendance}</div>
              <div><b>Disability:</b> {selectedRow.disability}</div>
              <div><b>OVC:</b> {selectedRow.ovc}</div>
              <div><b>Transfers:</b> {selectedRow.transfers}</div>
              <div><b>Health:</b> {selectedRow.health}</div>
              <div><b>Class:</b> {selectedRow.class}</div>
              <div><b>Contact Info:</b> {selectedRow.contact}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Edit Student</DialogTitle>
          <form className="space-y-4" onSubmit={handleEditSubmit}>
            <input name="name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="school" placeholder="School" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="gender" placeholder="Gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="age" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="enrollment" placeholder="Enrollment Date" value={form.enrollment} onChange={e => setForm({ ...form, enrollment: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="attendance" placeholder="Attendance Rate" value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="disability" placeholder="Disability" value={form.disability} onChange={e => setForm({ ...form, disability: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="ovc" placeholder="OVC" value={form.ovc} onChange={e => setForm({ ...form, ovc: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="transfers" placeholder="Transfers" value={form.transfers} onChange={e => setForm({ ...form, transfers: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="health" placeholder="Health" value={form.health} onChange={e => setForm({ ...form, health: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="class" placeholder="Class" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="contact" placeholder="Contact Info" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full border rounded p-2 text-black" />
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogTitle>Delete Student</DialogTitle>
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

export default StudentsPage;