import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Users, BookOpen, Calendar, TrendingDown, Phone, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchTeachers, createTeacher, updateTeacher, deleteTeacher } from "@/lib/api/api";

const TeachersPage: React.FC = () => {
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
    subject: "",
    gender: "",
    age: 0,
    recruitment: "",
    training: "",
    cpd: "",
    retirement: 0,
    ratio: "",
    absenteeism: 0,
    contact: "",
  });

  useEffect(() => {
    setLoading(true);
    fetchTeachers()
      .then((teachers) => setData(teachers))
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
      subject: row.subject || "",
      gender: row.gender || "",
      age: typeof row.age === 'number' ? row.age : Number(row.age) || 0,
      recruitment: row.recruitment || "",
      training: row.training || "",
      cpd: row.cpd || "",
      retirement: typeof row.retirement === 'number' ? row.retirement : Number(row.retirement) || 0,
      ratio: row.ratio || "",
      absenteeism: typeof row.absenteeism === 'number' ? row.absenteeism : Number(row.absenteeism) || 0,
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
      subject: "",
      gender: "",
      age: 0,
      recruitment: "",
      training: "",
      cpd: "",
      retirement: 0,
      ratio: "",
      absenteeism: 0,
      contact: "",
    });
    setOpenAdd(true);
  };
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacher = await createTeacher({ ...form, age: Number(form.age), retirement: Number(form.retirement) });
    setData([...data, newTeacher]);
    setOpenAdd(false);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;
    const updated = await updateTeacher(selectedRow.id, { ...form, age: Number(form.age), retirement: Number(form.retirement) });
    setData(data.map((d) => (d.id === selectedRow.id ? updated : d)));
    setOpenEdit(false);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;
    await deleteTeacher(selectedRow.id);
    setData(data.filter((d) => d.id !== selectedRow.id));
    setOpenDelete(false);
  };

  const teacherColumns = [
    {
      id: "rowNumber",
      header: "No.",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "school", header: "School" },
    { accessorKey: "subject", header: "Subject" },
    { accessorKey: "gender", header: "Gender" },
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

  const TeacherMetricCards = ({ data }: { data: any[] }) => {
    const totalTeachers = data.length;
    const avgAge = data.length
      ? (data.reduce((sum, t) => sum + (typeof t.age === 'number' ? t.age : Number(t.age) || 0), 0) / data.length).toFixed(1)
      : "0";
    const cpdCompleted = data.length
      ? (data.filter(t => t.cpd && t.cpd.toLowerCase() === "yes").length / data.length * 100).toFixed(0) + "%"
      : "0%";
    const avgAbsenteeism = data.length
      ? (data.reduce((sum, t) => sum + (typeof t.absenteeism === 'number' ? t.absenteeism : Number(t.absenteeism) || 0), 0) / data.length).toFixed(1) + "%"
      : "0%";
    const metrics = [
      { title: "Total Teachers", value: totalTeachers, icon: Users, color: "#137775", bg: "bg-[#137775]" },
      { title: "Avg. Age", value: avgAge, icon: Calendar, color: "#099773", bg: "bg-[#099773]" },
      { title: "CPD Completed", value: cpdCompleted, icon: BookOpen, color: "#F89D2D", bg: "bg-[#F89D2D]" },
      { title: "Absenteeism", value: avgAbsenteeism, icon: TrendingDown, color: "#e01024", bg: "bg-[#e01024]" },
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
            <div className="bg-white rounded-lg px-6 py-6 w-full flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teachers & Workforce Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Manage teacher database, recruitment, training, and more</p>
              </div>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <TeacherMetricCards data={data} />
          </div>
          <div className="w-full max-w-6xl flex justify-end mb-2">
            <Button className="bg-[#137775]" onClick={handleAdd}>Add Teacher</Button>
          </div>
          <Card className="w-full dark:bg-slate-500">
            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : (
              <DataTable columns={teacherColumns} data={data} userType="sectorCoordinator" initialLoading={false} />
            )}
          </Card>
        </div>
      </main>
      {/* Add Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Add Teacher</DialogTitle>
          <form className="space-y-4" onSubmit={handleAddSubmit}>
            <input name="name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="school" placeholder="School" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="subject" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="gender" placeholder="Gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="age" type="number" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: Number(e.target.value) })} className="w-full border rounded p-2 text-black" />
            <input name="recruitment" placeholder="Recruitment Date" value={form.recruitment} onChange={e => setForm({ ...form, recruitment: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="training" placeholder="Training/Certifications" value={form.training} onChange={e => setForm({ ...form, training: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="cpd" placeholder="CPD" value={form.cpd} onChange={e => setForm({ ...form, cpd: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="retirement" type="number" placeholder="Retirement Age" value={form.retirement} onChange={e => setForm({ ...form, retirement: Number(e.target.value) })} className="w-full border rounded p-2 text-black" />
            <input name="ratio" placeholder="Teacher-Student Ratio" value={form.ratio} onChange={e => setForm({ ...form, ratio: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="absenteeism" type="number" placeholder="Absenteeism (%)" value={form.absenteeism} onChange={e => setForm({ ...form, absenteeism: Number(e.target.value) })} className="w-full border rounded p-2 text-black" />
            <input name="contact" placeholder="Contact Info" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full border rounded p-2 text-black" />
            <Button type="submit">Add</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* View Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogTitle>Teacher Details</DialogTitle>
          {selectedRow && (
            <div className="space-y-2 text-black">
              <div><b>Name:</b> {selectedRow.name}</div>
              <div><b>School:</b> {selectedRow.school}</div>
              <div><b>Subject:</b> {selectedRow.subject}</div>
              <div><b>Gender:</b> {selectedRow.gender}</div>
              <div><b>Age:</b> {selectedRow.age}</div>
              <div><b>Recruitment Date:</b> {selectedRow.recruitment}</div>
              <div><b>Training/Certifications:</b> {selectedRow.training}</div>
              <div><b>CPD:</b> {selectedRow.cpd}</div>
              <div><b>Retirement Year:</b> {selectedRow.retirement}</div>
              <div><b>Teacher-Student Ratio:</b> {selectedRow.ratio}</div>
              <div><b>Absenteeism Rate:</b> {selectedRow.absenteeism}</div>
              <div><b>Contact Info:</b> {selectedRow.contact}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Edit Teacher</DialogTitle>
          <form className="space-y-4" onSubmit={handleEditSubmit}>
            <input name="name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="school" placeholder="School" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="subject" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="gender" placeholder="Gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="age" type="number" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: Number(e.target.value) })} className="w-full border rounded p-2 text-black" />
            <input name="recruitment" placeholder="Recruitment Date" value={form.recruitment} onChange={e => setForm({ ...form, recruitment: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="training" placeholder="Training/Certifications" value={form.training} onChange={e => setForm({ ...form, training: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="cpd" placeholder="CPD" value={form.cpd} onChange={e => setForm({ ...form, cpd: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="retirement" type="number" placeholder="Retirement Age" value={form.retirement} onChange={e => setForm({ ...form, retirement: Number(e.target.value) })} className="w-full border rounded p-2 text-black" />
            <input name="ratio" placeholder="Teacher-Student Ratio" value={form.ratio} onChange={e => setForm({ ...form, ratio: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="absenteeism" type="number" placeholder="Absenteeism (%)" value={form.absenteeism} onChange={e => setForm({ ...form, absenteeism: Number(e.target.value) })} className="w-full border rounded p-2 text-black" />
            <input name="contact" placeholder="Contact Info" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full border rounded p-2 text-black" />
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogTitle>Delete Teacher</DialogTitle>
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

export default TeachersPage; 