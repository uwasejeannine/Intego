import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "../Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Users, BookOpen, Calendar, TrendingDown, MoreHorizontal, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { fetchTeachers } from "@/lib/api/api";

const TeachersPage: React.FC = () => {
  const [openView, setOpenView] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


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
      <DistrictAdministratorSidebar />
      <main className="pl-[250px] pr-[20px] pt-20 bg-gray-50 min-h-screen">
        <div className="space-y-6 py-6">
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
            <Card className="w-full dark:bg-slate-500">
              {loading ? (
                <div className="p-8 text-center">Loading...</div>
              ) : (
                <DataTable columns={teacherColumns} data={data} userType="sectorCoordinator" initialLoading={false} />
              )}
            </Card>
          </div>
        </div>
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
      </main>
    </>
  );
};

export default TeachersPage; 