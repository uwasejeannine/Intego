import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { BookOpen, Users, TrendingDown, MapPin, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchInfrastructures, createInfrastructure, updateInfrastructure, deleteInfrastructure } from "@/lib/api/api";

const InfraMetricCards = ({ data }: { data: any[] }) => {
  const totalSchools = new Set(data.map(i => i.school)).size;
  const withElectricity = data.filter(i => (i.electricity || '').toLowerCase() === 'yes').length;
  const withMeals = data.filter(i => (i.meals || '').toLowerCase() === 'yes').length;
  const withICT = data.filter(i => (i.ict || '').toLowerCase() === 'yes').length;
  const metrics = [
    { title: "Total Schools", value: totalSchools, icon: BookOpen, color: "#137775", bg: "bg-[#137775]" },
    { title: "With Electricity", value: withElectricity, icon: Users, color: "#099773", bg: "bg-[#099773]" },
    { title: "With Meals", value: withMeals, icon: TrendingDown, color: "#F89D2D", bg: "bg-[#F89D2D]" },
    { title: "With ICT", value: withICT, icon: MapPin, color: "#e01024", bg: "bg-[#e01024]" },
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

const InfrastructurePage: React.FC = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({
    school: "",
    classrooms: "",
    desks: "",
    labs: "",
    libraries: "",
    latrines: "",
    electricity: "",
    water: "",
    meals: "",
    ict: "",
    textbooks: "",
    materials: "",
  });

  useEffect(() => {
    fetchInfrastructures()
      .then((infras) => setData(infras))
      .finally(() => {
        // No longer needed
      });
  }, []);

  const handleView = (row: any) => {
    setSelectedRow(row);
    setOpenView(true);
  };
  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setForm({
      school: row.school || "",
      classrooms: row.classrooms || "",
      desks: row.desks || "",
      labs: row.labs || "",
      libraries: row.libraries || "",
      latrines: row.latrines || "",
      electricity: row.electricity || "",
      water: row.water || "",
      meals: row.meals || "",
      ict: row.ict || "",
      textbooks: row.textbooks || "",
      materials: row.materials || "",
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
      classrooms: "",
      desks: "",
      labs: "",
      libraries: "",
      latrines: "",
      electricity: "",
      water: "",
      meals: "",
      ict: "",
      textbooks: "",
      materials: "",
    });
    setOpenAdd(true);
  };
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newInfra = await createInfrastructure(form);
    setData([...data, newInfra]);
    setOpenAdd(false);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;
    const updated = await updateInfrastructure(selectedRow.id, form);
    setData(data.map((d) => (d.id === selectedRow.id ? updated : d)));
    setOpenEdit(false);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;
    await deleteInfrastructure(selectedRow.id);
    setData(data.filter((d) => d.id !== selectedRow.id));
    setOpenDelete(false);
  };

  const infraColumns = [
    {
      id: "rowNumber",
      header: "No.",
      cell: ({ row }: any) => row.index + 1,
    },
    { accessorKey: "school", header: "School" },
    { accessorKey: "classrooms", header: "Classrooms" },
    { accessorKey: "labs", header: "Labs" },
    { accessorKey: "electricity", header: "Electricity" },
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
              <h1 className="text-2xl font-bold text-gray-900">Infrastructure & Resources Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Monitor classrooms, labs, ICT, meals, and more</p>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <InfraMetricCards data={data} />
          </div>
          <div className="w-full max-w-6xl flex justify-end mb-2">
            <Button className="bg-[#137775]" onClick={handleAdd}>Add Infrastructure</Button>
          </div>
          <Card className="w-full dark:bg-slate-500">
            <DataTable columns={infraColumns} data={data} userType="sectorCoordinator" initialLoading={false} />
          </Card>
        </div>
      </main>
      {/* Add Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Add Infrastructure</DialogTitle>
          <form className="space-y-4" onSubmit={handleAddSubmit}>
            <input name="school" placeholder="School" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="classrooms" placeholder="Classrooms" value={form.classrooms} onChange={e => setForm({ ...form, classrooms: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="desks" placeholder="Desks" value={form.desks} onChange={e => setForm({ ...form, desks: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="labs" placeholder="Labs" value={form.labs} onChange={e => setForm({ ...form, labs: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="libraries" placeholder="Libraries" value={form.libraries} onChange={e => setForm({ ...form, libraries: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="latrines" placeholder="Latrines" value={form.latrines} onChange={e => setForm({ ...form, latrines: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="electricity" placeholder="Electricity" value={form.electricity} onChange={e => setForm({ ...form, electricity: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="water" placeholder="Water" value={form.water} onChange={e => setForm({ ...form, water: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="meals" placeholder="Meals" value={form.meals} onChange={e => setForm({ ...form, meals: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="ict" placeholder="ICT" value={form.ict} onChange={e => setForm({ ...form, ict: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="textbooks" placeholder="Textbooks" value={form.textbooks} onChange={e => setForm({ ...form, textbooks: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="materials" placeholder="Materials" value={form.materials} onChange={e => setForm({ ...form, materials: e.target.value })} className="w-full border rounded p-2 text-black" />
            <Button type="submit">Add</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* View Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogTitle>Infrastructure Details</DialogTitle>
          {selectedRow && (
            <div className="space-y-2 text-black">
              <div><b>School:</b> {selectedRow.school}</div>
              <div><b>Classrooms:</b> {selectedRow.classrooms}</div>
              <div><b>Desks:</b> {selectedRow.desks}</div>
              <div><b>Labs:</b> {selectedRow.labs}</div>
              <div><b>Libraries:</b> {selectedRow.libraries}</div>
              <div><b>Latrines:</b> {selectedRow.latrines}</div>
              <div><b>Electricity:</b> {selectedRow.electricity}</div>
              <div><b>Water:</b> {selectedRow.water}</div>
              <div><b>Meals:</b> {selectedRow.meals}</div>
              <div><b>ICT:</b> {selectedRow.ict}</div>
              <div><b>Textbooks:</b> {selectedRow.textbooks}</div>
              <div><b>Materials:</b> {selectedRow.materials}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogTitle>Edit Infrastructure</DialogTitle>
          <form className="space-y-4" onSubmit={handleEditSubmit}>
            <input name="school" placeholder="School" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required className="w-full border rounded p-2 text-black" />
            <input name="classrooms" placeholder="Classrooms" value={form.classrooms} onChange={e => setForm({ ...form, classrooms: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="desks" placeholder="Desks" value={form.desks} onChange={e => setForm({ ...form, desks: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="labs" placeholder="Labs" value={form.labs} onChange={e => setForm({ ...form, labs: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="libraries" placeholder="Libraries" value={form.libraries} onChange={e => setForm({ ...form, libraries: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="latrines" placeholder="Latrines" value={form.latrines} onChange={e => setForm({ ...form, latrines: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="electricity" placeholder="Electricity" value={form.electricity} onChange={e => setForm({ ...form, electricity: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="water" placeholder="Water" value={form.water} onChange={e => setForm({ ...form, water: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="meals" placeholder="Meals" value={form.meals} onChange={e => setForm({ ...form, meals: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="ict" placeholder="ICT" value={form.ict} onChange={e => setForm({ ...form, ict: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="textbooks" placeholder="Textbooks" value={form.textbooks} onChange={e => setForm({ ...form, textbooks: e.target.value })} className="w-full border rounded p-2 text-black" />
            <input name="materials" placeholder="Materials" value={form.materials} onChange={e => setForm({ ...form, materials: e.target.value })} className="w-full border rounded p-2 text-black" />
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogTitle>Delete Infrastructure</DialogTitle>
          <div className="text-black">Are you sure you want to delete <b>{selectedRow?.school}</b>?</div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button className="bg-red-600 text-white" onClick={handleDeleteConfirm}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InfrastructurePage; 