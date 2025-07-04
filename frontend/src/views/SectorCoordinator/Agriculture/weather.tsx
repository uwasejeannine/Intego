import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2, Sun, CloudRain,  AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const currentWeather = { temp: 24, condition: "Sunny", humidity: 60, wind: 12 };
const forecastInit = [
  { day: "Mon", temp: 25, condition: "Sunny" },
  { day: "Tue", temp: 23, condition: "Cloudy" },
  { day: "Wed", temp: 22, condition: "Rain" },
  { day: "Thu", temp: 24, condition: "Sunny" },
  { day: "Fri", temp: 21, condition: "Rain" },
  { day: "Sat", temp: 22, condition: "Cloudy" },
  { day: "Sun", temp: 23, condition: "Sunny" },
];
const alertsInit = [
  { type: "Rainfall Warning", message: "Heavy rain expected on Wednesday and Friday." },
];

// Metric Cards Component
const WeatherMetricCards = ({ currentWeather, forecast, alerts }: { currentWeather: any, forecast: any[], alerts: any[] }) => {
  const avgTemp = forecast.length ? Math.round(forecast.reduce((sum, f) => sum + f.temp, 0) / forecast.length) : 0;
  const rainDays = forecast.filter(f => f.condition.toLowerCase().includes("rain")).length;
  const metrics = [
    {
      title: 'Current Temp',
      value: `${currentWeather.temp}°C`,
      change: `${currentWeather.humidity}% humidity`,
      changeText: `Wind: ${currentWeather.wind} km/h`,
      isPositive: true,
      icon: Sun,
      bg: 'bg-[#137775]'
    },
    {
      title: 'Avg Forecast Temp',
      value: `${avgTemp}°C`,
      change: `${rainDays} days rain`,
      changeText: 'This week',
      isPositive: rainDays < 3,
      icon: CloudRain,
      bg: 'bg-[#F89D2D]'
    },
    {
      title: 'Weather Alerts',
      value: alerts.length.toString(),
      change: alerts.length > 0 ? 'Active' : 'None',
      changeText: alerts.length > 0 ? alerts[0].type : 'No alerts',
      isPositive: alerts.length === 0,
      icon: AlertTriangle,
      bg: 'bg-[#144c49]'
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 min-h-[120px]"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${metric.bg} shadow-lg`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  metric.isPositive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {metric.change}
                </div>
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                {metric.title}
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {metric.value}
              </div>
              <div className="flex items-center text-xs">
                <span className={`font-medium ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-gray-500 ml-1">
                  {metric.changeText}
                </span>
              </div>
              <div className={`mt-2 h-1 rounded-full ${metric.bg} opacity-20`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const forecastColumns = (
  setViewForecast: (row: any) => void,
  setViewForecastOpen: (open: boolean) => void,
  setEditForecast: (row: any) => void,
  setEditForecastOpen: (open: boolean) => void,
  handleDeleteForecast: (row: any) => void
) => [
  { accessorKey: "day", header: "Day" },
  { accessorKey: "temp", header: "Temp (°C)" },
  { accessorKey: "condition", header: "Condition" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => { setViewForecast(row.original); setViewForecastOpen(true); }}>
            <Eye className="h-4 w-4 mr-2 text-blue-600" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setEditForecast(row.original); setEditForecastOpen(true); }}>
            <Pencil className="h-4 w-4 mr-2 text-yellow-600" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeleteForecast(row.original)}>
            <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const WeatherInfoPage: React.FC = () => {
  const [forecast, setForecast] = useState(forecastInit);
  const [alerts] = useState(alertsInit);
  // For forecast actions
  const [addForecastOpen, setAddForecastOpen] = useState(false);
  const [viewForecast, setViewForecast] = useState<any>(null);
  const [viewForecastOpen, setViewForecastOpen] = useState(false);
  const [editForecast, setEditForecast] = useState<any>(null);
  const [editForecastOpen, setEditForecastOpen] = useState(false);
  const [newForecast, setNewForecast] = useState({ day: "", temp: "", condition: "" });

  const handleDeleteForecast = (row: any) => {
    if (window.confirm("Are you sure you want to delete this forecast entry?")) {
      setForecast(forecast.filter((f) => f !== row));
    }
  };

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24 min-h-screen">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          <div className="flex w-full max-w-6xl justify-between items-center mb-4">
            <div className="bg-white rounded-lg px-6 py-6 w-full">
              <h1 className="text-2xl font-bold text-gray-900">Weather Dashboard</h1>
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <WeatherMetricCards currentWeather={currentWeather} forecast={forecast} alerts={alerts} />
          </div>
          <Card className="w-full dark:bg-slate-500">
            <div className="flex justify-between items-center px-6 pt-6">
              <h2 className="text-lg font-semibold text-[#137775]">7-Day Forecast</h2>
              <Dialog open={addForecastOpen} onOpenChange={setAddForecastOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#137775] text-white">Add Forecast</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Add New Forecast</DialogTitle>
                  <form className="space-y-4" onSubmit={e => { e.preventDefault(); setForecast([...forecast, { ...newForecast, temp: Number(newForecast.temp) }]); setAddForecastOpen(false); setNewForecast({ day: "", temp: "", condition: "" }); }}>
                    <input className="w-full border rounded p-2 text-black" placeholder="Day" value={newForecast.day} onChange={e => setNewForecast({ ...newForecast, day: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Temp (°C)" type="number" value={newForecast.temp} onChange={e => setNewForecast({ ...newForecast, temp: e.target.value })} required />
                    <input className="w-full border rounded p-2 text-black" placeholder="Condition" value={newForecast.condition} onChange={e => setNewForecast({ ...newForecast, condition: e.target.value })} required />
                    <Button type="submit" className="bg-[#137775] text-white">Add</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="px-6 pb-6">
              <Dialog open={viewForecastOpen} onOpenChange={setViewForecastOpen}>
                <DialogContent>
                  <DialogTitle>Forecast Details</DialogTitle>
                  {viewForecast && (
                    <div className="space-y-2 text-black">
                      <div><b>Day:</b> {viewForecast.day}</div>
                      <div><b>Temp (°C):</b> {viewForecast.temp}</div>
                      <div><b>Condition:</b> {viewForecast.condition}</div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Dialog open={editForecastOpen} onOpenChange={setEditForecastOpen}>
                <DialogContent>
                  <DialogTitle>Edit Forecast</DialogTitle>
                  {editForecast && (
                    <form className="space-y-4" onSubmit={e => {
                      e.preventDefault();
                      setForecast(forecast.map(f => f === editForecast ? editForecast : f));
                      setEditForecastOpen(false);
                    }}>
                      <input className="w-full border rounded p-2 text-black" placeholder="Day" value={editForecast.day} onChange={e => setEditForecast({ ...editForecast, day: e.target.value })} required />
                      <input className="w-full border rounded p-2 text-black" placeholder="Temp (°C)" type="number" value={editForecast.temp} onChange={e => setEditForecast({ ...editForecast, temp: e.target.value })} required />
                      <input className="w-full border rounded p-2 text-black" placeholder="Condition" value={editForecast.condition} onChange={e => setEditForecast({ ...editForecast, condition: e.target.value })} required />
                      <Button type="submit" className="bg-[#137775] text-white">Save</Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
              <DataTable columns={forecastColumns(setViewForecast, setViewForecastOpen, setEditForecast, setEditForecastOpen, handleDeleteForecast)} data={forecast} userType="sectorCoordinator" initialLoading={false} scrollable />
            </div>
          </Card>
        </div>
      </main>
    </>
  );
};

export default WeatherInfoPage; 