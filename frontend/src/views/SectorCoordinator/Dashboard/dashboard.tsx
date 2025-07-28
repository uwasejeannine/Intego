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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api/api"; // ✅ Use the configured API instance instead of axios
import { Users, Leaf, Stethoscope, School, AlertCircle } from "lucide-react";

//  Use relative paths since api instance already has baseURL configured
const API_FARMERS = "/farmers/individual/";
const API_COOPS = "/farmers/cooperatives";
const API_HEALTH = "/hospital";
const API_SCHOOLS = "/schools";
const API_CROPS = "/crops";
const API_USER_PROFILE = "/user/profile"; // Add user profile endpoint

const COLORS = ["#137775", "#099773", "#ef8f20"];

// Rwanda Districts and Sectors for fallback
const RWANDA_LOCATIONS = [
  { district: "Nyarugenge", sector: "Gitega" },
  { district: "Nyarugenge", sector: "Kanyinya" },
  { district: "Nyarugenge", sector: "Kigali" },
  { district: "Nyarugenge", sector: "Kimisagara" },
  { district: "Nyarugenge", sector: "Mageragere" },
  { district: "Nyarugenge", sector: "Muhima" },
  { district: "Nyarugenge", sector: "Nyakabanda" },
  { district: "Nyarugenge", sector: "Nyamirambo" },
  { district: "Nyarugenge", sector: "Rwezamenyo" },
  { district: "Kicukiro", sector: "Gahanga" },
  { district: "Kicukiro", sector: "Gatenga" },
  { district: "Kicukiro", sector: "Gikondo" },
  { district: "Kicukiro", sector: "Kanombe" },
  { district: "Kicukiro", sector: "Kicukiro" },
  { district: "Kicukiro", sector: "Kigarama" },
  { district: "Kicukiro", sector: "Masaka" },
  { district: "Kicukiro", sector: "Niboye" },
  { district: "Kicukiro", sector: "Nyarugunga" },
  { district: "Kicukiro", sector: "Ruhango" },
  { district: "Gasabo", sector: "Bumbogo" },
  { district: "Gasabo", sector: "Gatsata" },
  { district: "Gasabo", sector: "Gikomero" },
  { district: "Gasabo", sector: "Gisozi" },
  { district: "Gasabo", sector: "Jabana" },
  { district: "Gasabo", sector: "Jali" },
  { district: "Gasabo", sector: "Kacyiru" },
  { district: "Gasabo", sector: "Kimironko" },
  { district: "Gasabo", sector: "Kinyinya" },
  { district: "Gasabo", sector: "Ndera" },
  { district: "Gasabo", sector: "Nduba" },
  { district: "Gasabo", sector: "Remera" },
  { district: "Gasabo", sector: "Rusororo" },
  { district: "Gasabo", sector: "Rutunga" },
  { district: "Rwabihu", sector: "Bigogwe" },
  { district: "Rwabihu", sector: "Boneza" },
  { district: "Rwabihu", sector: "Jenda" },
  { district: "Rwabihu", sector: "Jomba" },
  { district: "Rwabihu", sector: "Nyundo" },
  { district: "Rwabihu", sector: "Rambura" },
  { district: "Rwabihu", sector: "Remera" },
  { district: "Rwabihu", sector: "Rugabano" },
  { district: "Rwabihu", sector: "Rugerero" },
  { district: "Rwabihu", sector: "Shyira" },
  { district: "Musanze", sector: "Busogo" },
  { district: "Musanze", sector: "Cyuve" },
  { district: "Musanze", sector: "Gacaca" },
  { district: "Musanze", sector: "Gashaki" },
  { district: "Musanze", sector: "Gataraga" },
  { district: "Musanze", sector: "Kimonyi" },
  { district: "Musanze", sector: "Kinigi" },
  { district: "Musanze", sector: "Muhoza" },
  { district: "Musanze", sector: "Muko" },
  { district: "Musanze", sector: "Musanze" },
  { district: "Musanze", sector: "Nkotsi" },
  { district: "Musanze", sector: "Nyange" },
  { district: "Musanze", sector: "Remera" },
  { district: "Musanze", sector: "Rwaza" },
  { district: "Musanze", sector: "Shingiro" },
];

// Types for better type safety
interface Farmer {
  id: number;
  first_name: string;
  last_name: string;
  // Add other farmer properties as needed
}

interface Cooperative {
  id: number;
  cooperative_name: string;
  // Add other cooperative properties as needed
}

interface HealthFacility {
  id: number;
  name: string;
  // Add other health facility properties as needed
}

interface School {
  id: number;
  school_name: string;
  // Add other school properties as needed
}

interface Crop {
  id: number;
  crop_name: string;
  // Add other crop properties as needed
}

interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  name?: string;
  district?: string | null;
  sector?: string | null;
  // Add other user properties as needed
}

// Function to get random location
const getRandomLocation = () => {
  const randomIndex = Math.floor(Math.random() * RWANDA_LOCATIONS.length);
  return RWANDA_LOCATIONS[randomIndex];
};

const SectorCoordinatorDashboardPage: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [healthFacilities, setHealthFacilities] = useState<HealthFacility[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userLocation, setUserLocation] = useState<{district: string, sector: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Starting to fetch dashboard data...');
        
        // ✅ Use Promise.allSettled instead of Promise.all to handle partial failures
        const results = await Promise.allSettled([
          api.get(API_FARMERS),
          api.get(API_COOPS),
          api.get(API_CROPS),
          api.get(API_HEALTH),
          api.get(API_SCHOOLS),
          api.get(API_USER_PROFILE), // Fetch user profile
        ]);

        // Handle farmers data
        if (results[0].status === 'fulfilled') {
          const farmersData = results[0].value.data;
          setFarmers(farmersData?.data || farmersData || []);
          console.log('✅ Farmers data loaded:', farmersData?.data?.length || 0);
        } else {
          console.error('❌ Failed to fetch farmers:', results[0].reason);
          setFarmers([]);
        }

        // Handle cooperatives data
        if (results[1].status === 'fulfilled') {
          const coopsData = results[1].value.data;
          setCooperatives(coopsData?.data || coopsData || []);
          console.log('✅ Cooperatives data loaded:', coopsData?.data?.length || 0);
        } else {
          console.error('❌ Failed to fetch cooperatives:', results[1].reason);
          setCooperatives([]);
        }

        // Handle crops data
        if (results[2].status === 'fulfilled') {
          const cropsData = results[2].value.data;
          setCrops(cropsData?.data || cropsData || []);
          console.log('✅ Crops data loaded:', cropsData?.data?.length || 0);
        } else {
          console.error('❌ Failed to fetch crops:', results[2].reason);
          setCrops([]);
        }

        // Handle health facilities data
        if (results[3].status === 'fulfilled') {
          const healthData = results[3].value.data;
          setHealthFacilities(healthData?.data || healthData || []);
          console.log('✅ Health facilities data loaded:', healthData?.data?.length || 0);
        } else {
          console.error('❌ Failed to fetch health facilities:', results[3].reason);
          setHealthFacilities([]);
        }

        // Handle schools data
        if (results[4].status === 'fulfilled') {
          const schoolsData = results[4].value.data;
          setSchools(schoolsData?.data || schoolsData || []);
          console.log('✅ Schools data loaded:', schoolsData?.data?.length || 0);
        } else {
          console.error('❌ Failed to fetch schools:', results[4].reason);
          setSchools([]);
        }

        // Handle user profile data
        if (results[5].status === 'fulfilled') {
          const userData = results[5].value.data;
          const userInfo = userData?.data || userData || null;
          setUser(userInfo);
          
          // Set user location - use existing data or generate random fallback
          if (userInfo?.district && userInfo?.sector) {
            setUserLocation({
              district: userInfo.district,
              sector: userInfo.sector
            });
          } else {
            // Generate random location if user doesn't have district/sector
            const randomLocation = getRandomLocation();
            setUserLocation(randomLocation);
          }
          
          console.log('✅ User data loaded:', userInfo);
        } else {
          console.error('❌ Failed to fetch user profile:', results[5].reason);
          // Set fallback user and random location
          setUser(null);
          setUserLocation(getRandomLocation());
        }

        // Check if any requests failed
        const failedRequests = results.filter(result => result.status === 'rejected');
        if (failedRequests.length > 0) {
          console.warn(`⚠️ ${failedRequests.length} out of 6 requests failed`);
        }

      } catch (err: any) {
        console.error('❌ Unexpected error fetching data:', err);
        setError(err.message || 'Failed to load dashboard data');
        
        // Set empty arrays as fallback
        setFarmers([]);
        setCooperatives([]);
        setCrops([]);
        setHealthFacilities([]);
        setSchools([]);
        setUser(null);
        setUserLocation(getRandomLocation());
      } finally {
        setLoading(false);
        console.log('🏁 Data fetching completed');
      }
    };

    fetchData();
  }, []);

  // Mock sector performance data - you can replace this with real data from your API
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

  const alerts = [
    {
      id: 1,
      type: "critical",
      sector: "Health",
      message: `Malaria cases increased by 15% in ${userLocation?.sector || 'Kinyinya'} sector`,
      time: "2 hours ago",
      priority: "high" as const,
    },
    {
      id: 2,
      type: "warning",
      sector: "Agriculture",
      message: "Drought conditions affecting 3 sectors",
      time: "4 hours ago",
      priority: "medium" as const,
    },
    {
      id: 3,
      type: "info",
      sector: "Education",
      message: `New school construction completed in ${userLocation?.sector || 'Remera'}`,
      time: "1 day ago",
      priority: "low" as const,
    },
  ];

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user?.name) {
      return user.name;
    } else if (user?.first_name) {
      return user.first_name;
    } else {
      return "";
    }
  };

  return (
    <>
      <Navbar className="z-[1]" />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4 pt-24">

          {/* Welcome Section */}
          <div className="bg-[#137775] rounded-lg shadow-lg p-6 text-white w-full max-w-6xl">
            <h1 className="text-2xl font-bold">
              Welcome to {userLocation?.sector || 'Bigogwe'} sector in {userLocation?.district || 'Rwabihu'} District {getUserDisplayName()}!
            </h1>
            <p className="text-primary-100 mt-2">
              Local Government Dashboard
            </p>
            <div className="mt-4 flex items-center space-x-4">
     
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-sm">{alerts.length} Active Alerts</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-sm">
                  Location: {userLocation?.sector || 'Bigogwe'}, {userLocation?.district || 'Rwabihu'}
                </span>
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
                  <button
                    onClick={() => navigate("/district-admin/alerts")}
                    className="w-full text-center text-sm text-[#137775] hover:text-[#0f5f5d] font-medium transition-colors"
                  >
                    View all alerts →
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="bg-white rounded-lg shadow-sm border p-6">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#099773] rounded-full mt-2"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Updated cooperative information</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#ef8f20] rounded-full mt-2"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">System maintenance completed</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full text-center text-sm text-[#137775] hover:text-[#0f5f5d] font-medium transition-colors">
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
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {Number(value || 0).toLocaleString()}
          </div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SectorCoordinatorDashboardPage;
