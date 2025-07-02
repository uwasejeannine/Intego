import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import { Users, Leaf, Stethoscope, School } from "lucide-react";

const API_FARMERS = "http://localhost:3000/api/v1/farmers/individual/";
const API_COOPS = "http://localhost:3000/api/v1/farmers/cooperatives";
const API_HEALTH = "http://localhost:3000/api/v1/hospital";
const API_SCHOOLS = "http://localhost:3000/api/v1/schools";
const API_CROPS = "http://localhost:3000/api/v1/crops";

const COLORS = ["#137775", "#099773", "#ef8f20"];

const SectorCoordinatorDashboardPage: React.FC = () => {
  const [farmers, setFarmers] = useState([]);
  const [cooperatives, setCooperatives] = useState([]);
  const [crops, setCrops] = useState([]);
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [farmersRes, coopsRes, cropsRes, healthRes, schoolsRes] = await Promise.all([
          axios.get(API_FARMERS),
          axios.get(API_COOPS),
          axios.get(API_CROPS),
          axios.get(API_HEALTH),
          axios.get(API_SCHOOLS),
        ]);
        setFarmers(farmersRes.data?.data || farmersRes.data || []);
        setCooperatives(coopsRes.data?.data || coopsRes.data || []);
        setCrops(cropsRes.data?.data || cropsRes.data || []);
        setHealthFacilities(healthRes.data?.data || healthRes.data || []);
        setSchools(schoolsRes.data?.data || schoolsRes.data || []);
      } catch (err) {
        setFarmers([]);
        setCooperatives([]);
        setCrops([]);
        setHealthFacilities([]);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mock data for health and education
  const totalPopulation = 486240;

  // Mock sector performance data
  const sectorsData = [
    { name: "Kinyinya", agriculture: 78, health: 85, education: 92 },
    { name: "Remera", agriculture: 82, health: 88, education: 89 },
    { name: "Kimironko", agriculture: 75, health: 91, education: 87 },
    { name: "Gisozi", agriculture: 88, health: 83, education: 94 },
    { name: "Jabana", agriculture: 71, health: 86, education: 88 },
    { name: "Jali", agriculture: 84, health: 89, education: 91 },
  ];

  const performanceData = [
    { name: "Agriculture", value: 78, color: COLORS[0] },
    { name: "Health", value: 87, color: COLORS[1] },
    { name: "Education", value: 91, color: COLORS[2] },
  ];

  const agricultureTrends = [
    { month: "Sep", seasonA: 32, seasonB: 0, seasonC: 15 },
    { month: "Oct", seasonA: 45, seasonB: 0, seasonC: 28 },
    { month: "Nov", seasonA: 68, seasonB: 0, seasonC: 12 },
    { month: "Dec", seasonA: 85, seasonB: 0, seasonC: 5 },
    { month: "Jan", seasonA: 92, seasonB: 0, seasonC: 0 },
    { month: "Feb", seasonA: 78, seasonB: 12, seasonC: 0 },
  ];

  const alerts = [
    {
      id: 1,
      type: "critical",
      sector: "Health",
      message: "Malaria cases increased by 15% in Kinyinya sector",
      time: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      type: "warning",
      sector: "Agriculture",
      message: "Drought conditions affecting 3 sectors",
      time: "4 hours ago",
      priority: "medium",
    },
    {
      id: 3,
      type: "info",
      sector: "Education",
      message: "New school construction completed in Remera",
      time: "1 day ago",
      priority: "low",
    },
  ];

  const totalFarmers = (farmers.length || 0) + (cooperatives.length || 0);

  return (
    <>
      <Navbar className="z-[1]" />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4 pt-24">
          {/* Welcome Section */}
          <div className="bg-[#137775] rounded-lg shadow-lg p-6 text-white w-full max-w-6xl">
            <h1 className="text-2xl font-bold">Welcome, Sector Coordinator!</h1>
            <p className="text-primary-100 mt-2">Local Government Dashboard</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm">System Status: Operational</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-sm">3 Active Alerts</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            <MetricCard
              title="Total Farmers"
              value={Number(farmers?.length || 0).toLocaleString()}
              subtitle="All farmers in the system"
              color="green"
              icon={<Leaf className="w-5 h-5" style={{ color: '#099773' }} />}
            />
            <MetricCard
              title="Total Cooperatives"
              value={Number(cooperatives?.length || 0).toLocaleString()}
              subtitle="All cooperatives in the system"
              color="blue"
              icon={<Users className="w-5 h-5" style={{ color: '#137775' }} />}
            />
            <MetricCard
              title="Health Facilities"
              value={Number(healthFacilities?.length || 0).toLocaleString()}
              subtitle="All levels"
              color="red"
              icon={<Stethoscope className="w-5 h-5" style={{ color: '#ef8f20' }} />}
            />
            <MetricCard
              title="Schools"
              value={Number(schools?.length || 0).toLocaleString()}
              subtitle="All levels"
              color="purple"
              icon={<School className="w-5 h-5" style={{ color: '#137775' }} />}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
            {/* Sector Performance Overview */}
            <Card className="bg-white rounded-lg shadow-sm border p-6">
              <CardHeader>
                <CardTitle>Sector Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="agriculture" fill="#137775" name="Agriculture" />
                    <Bar dataKey="health" fill="#099773" name="Health" />
                    <Bar dataKey="education" fill="#ef8f20" name="Education" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card className="bg-white rounded-lg shadow-sm border p-6">
              <CardHeader>
                <CardTitle>Overall Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Agricultural Seasonal Trends */}
          <Card className="bg-white rounded-lg shadow-sm border p-6 w-full max-w-6xl">
            <CardHeader>
              <CardTitle>Agricultural Seasonal Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={agricultureTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="seasonA" stroke="#137775" name="Season A" strokeWidth={2} />
                  <Line type="monotone" dataKey="seasonB" stroke="#099773" name="Season B" strokeWidth={2} />
                  <Line type="monotone" dataKey="seasonC" stroke="#ef8f20" name="Season C" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Alerts and Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
            {/* Recent Alerts */}
            <Card className="bg-white rounded-lg shadow-sm border p-6">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        alert.priority === "high"
                          ? "bg-red-50 border border-red-200"
                          : alert.priority === "medium"
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <span className={`h-5 w-5 mt-0.5 rounded-full ${
                        alert.priority === "high"
                          ? "bg-red-500"
                          : alert.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {alert.sector} • {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button className="w-full text-center text-sm text-[#137775] hover:text-[#0f5f5d] font-medium">
                    View all alerts →
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities (mocked) */}
            <Card className="bg-white rounded-lg shadow-sm border p-6">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Replace with real activities if available */}
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#137775] rounded-full mt-2"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Added new farmer registration</p>
                      <p className="text-xs text-gray-500">Today, 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#137775] rounded-full mt-2"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Updated health facility data</p>
                      <p className="text-xs text-gray-500">Yesterday, 3:15 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#137775] rounded-full mt-2"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Added new school construction</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full text-center text-sm text-[#137775] hover:text-[#0f5f5d] font-medium">
                    View all activities →
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
}> = ({ title, value, subtitle, color, icon }) => {
  const colorClasses: Record<string, string> = {
    blue: "text-[#137775] bg-blue-100",
    green: "text-green-600 bg-green-100",
    red: "text-red-600 bg-red-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {Number(value || 0).toLocaleString()}
          </div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

export default SectorCoordinatorDashboardPage;