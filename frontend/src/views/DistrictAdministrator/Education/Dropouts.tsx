import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "../Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { TrendingDown, Users, Calendar, Phone, MoreHorizontal, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { fetchDropouts } from "@/lib/api/api";

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

const DropoutsPage: React.FC = () => {
  const [openView, setOpenView] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDropouts()
      .then((dropouts) => setData(dropouts))
      .finally(() => setLoading(false));
  }, []);

  const handleView = (row: any) => {
    setSelectedRow(row);
    setOpenView(true);
  };
  return (
    <>
      <Navbar />
      <DistrictAdministratorSidebar />
      <main className="pl-[250px] pr-[20px] pt-20 bg-gray-50 min-h-screen">
        <div className="space-y-6 py-6">
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
            <Card className="w-full dark:bg-slate-500">
              {loading ? (
                <div className="p-8 text-center">Loading...</div>
              ) : (
                <DataTable columns={dropoutColumns.map(col =>
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  } : col
                )} data={data} userType="sectorCoordinator" initialLoading={false} />
              )}
            </Card>
          </div>
        </div>
      </main>
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
    </>
  );
};

export default DropoutsPage; 