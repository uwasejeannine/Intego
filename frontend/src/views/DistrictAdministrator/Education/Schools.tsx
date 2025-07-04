import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "../Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Eye, MoreHorizontal, Users, MapPin, BookOpen, TrendingDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchSchools } from "@/lib/api/api";

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
  const [openView, setOpenView] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
            <div className="w-full max-w-6xl">
              <Card className="w-full dark:bg-slate-500">
                {loading ? (
                  <div className="p-8 text-center">Loading...</div>
                ) : (
                  <DataTable columns={schoolColumns} data={data} userType="sectorCoordinator" initialLoading={false} />
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
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
    </>
  );
};

export default SchoolsPage; 