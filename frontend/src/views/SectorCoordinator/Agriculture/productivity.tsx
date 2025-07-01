import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingDown, Truck, Users } from "lucide-react";

const mockOverview = [
  { label: "Total Output", value: 12500, unit: "MT" },
  { label: "Yield/Ha", value: 3.2, unit: "T/Ha" },
  { label: "Cultivated Area", value: 4200, unit: "Ha" },
  { label: "Active Farmers", value: 3200, unit: "" },
];
const byCrop = [
  { crop: "Maize", output: 5200, yield: 2.8, area: 1800 },
  { crop: "Beans", output: 3400, yield: 1.9, area: 1700 },
  { crop: "Rice", output: 2100, yield: 4.1, area: 510 },
];
const byRegion = [
  { region: "Kigali", output: 4200, yield: 3.5, area: 1200 },
  { region: "Eastern", output: 3800, yield: 2.9, area: 1400 },
  { region: "Northern", output: 3500, yield: 3.2, area: 1600 },
];
const chartData = [
  { name: "Maize", output: 5200 },
  { name: "Beans", output: 3400 },
  { name: "Rice", output: 2100 },
];

// Metric Cards for Productivity
const ProductivityMetricCards = ({ stats }: { stats: any[] }) => {
  // Assign colors/icons similar to seeds/fertilizers
  const metrics = [
    {
      title: stats[0].label,
      value: `${stats[0].value} ${stats[0].unit}`,
      icon: Package,
      bg: 'bg-[#137775]'
    },
    {
      title: stats[1].label,
      value: `${stats[1].value} ${stats[1].unit}`,
      icon: Truck,
      bg: 'bg-[#F89D2D]'
    },
    {
      title: stats[2].label,
      value: `${stats[2].value} ${stats[2].unit}`,
      icon: TrendingDown,
      bg: 'bg-[#099773]'
    },
    {
      title: stats[3].label,
      value: `${stats[3].value} ${stats[3].unit}`,
      icon: Users,
      bg: 'bg-[#144c49]'
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              </div>
              <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                {metric.title}
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {metric.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ProductivityPage: React.FC = () => {
  const [tab, setTab] = useState("overview");
  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24 min-h-screen">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          {/* Metric Cards */}
          <div className="w-full max-w-6xl">
            <ProductivityMetricCards stats={mockOverview} />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="w-full max-w-6xl space-y-4">
            <Card className="h-[70px] w-full flex items-center pl-[30px] justify-between dark:bg-slate-500">
              <TabsList className="w-full flex justify-between items-center">
                <div>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="by-crop">By Crop</TabsTrigger>
                  <TabsTrigger value="by-region">By Region</TabsTrigger>
                </div>
              </TabsList>
            </Card>
            <Card className="w-full dark:bg-slate-500">
              <TabsContent value="overview">
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                  <h2 className="text-lg font-semibold text-[#137775] mb-4">Productivity by Crop</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="output" fill="#137775" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <button className="bg-[#137775] text-white px-4 py-2 rounded">Export Data</button>
              </TabsContent>
              <TabsContent value="by-crop">
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                  <h2 className="text-lg font-semibold text-[#137775] mb-4">By Crop</h2>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Output (MT)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield (T/Ha)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area (Ha)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {byCrop.map((row) => (
                        <tr key={row.crop}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.crop}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.output}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.yield}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.area}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="bg-[#137775] text-white px-4 py-2 rounded">Export Data</button>
              </TabsContent>
              <TabsContent value="by-region">
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                  <h2 className="text-lg font-semibold text-[#137775] mb-4">By Region</h2>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Output (MT)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield (T/Ha)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area (Ha)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {byRegion.map((row) => (
                        <tr key={row.region}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.region}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.output}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.yield}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.area}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="bg-[#137775] text-white px-4 py-2 rounded">Export Data</button>
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default ProductivityPage; 