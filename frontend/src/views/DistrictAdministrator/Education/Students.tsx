import React, { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Eye, MoreHorizontal} from "lucide-react";
import { Navbar } from "@/components/navigation/main-navbar";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Users, Calendar, Heart, TrendingDown } from "lucide-react";
import { fetchStudents} from "@/lib/api/api";
import DistrictAdministratorSidebar from "../Navigation/sidebar-menu";

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
  const [openView, setOpenView] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
            <Card className="w-full dark:bg-slate-500">
              {loading ? (
                <div className="p-8 text-center">Loading...</div>
              ) : (
                <DataTable columns={studentColumns} data={data} userType="sectorCoordinator" initialLoading={false} />
              )}
            </Card>
          </div>
        </div>
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
      </main>
    </>
  );
};

export default StudentsPage;