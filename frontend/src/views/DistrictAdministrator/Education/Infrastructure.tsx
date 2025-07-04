import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "../Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { BookOpen, Users, TrendingDown, MapPin, MoreHorizontal, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { fetchInfrastructures } from "@/lib/api/api";

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
  const [openView, setOpenView] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchInfrastructures()
      .then((infras) => setData(infras))
      .finally(() => setLoading(false));
  }, []);

  const handleView = (row: any) => {
    setSelectedRow(row);
    setOpenView(true);
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
                <h1 className="text-2xl font-bold text-gray-900">Infrastructure & Resources Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Monitor classrooms, labs, ICT, meals, and more</p>
              </div>
            </div>
            <div className="w-full max-w-6xl">
              <InfraMetricCards data={data} />
            </div>
            <Card className="w-full dark:bg-slate-500">
              {loading ? (
                <div className="p-8 text-center">Loading...</div>
              ) : (
                <DataTable columns={infraColumns} data={data} userType="sectorCoordinator" initialLoading={false} />
              )}
            </Card>
          </div>
        </div>
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
      </main>
    </>
  );
};

export default InfrastructurePage; 