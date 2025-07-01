import React, { useState } from 'react';
import {
  UsersIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
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
  AreaChart,
  Area,
} from 'recharts';
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { Navbar } from "@/components/navigation/main-navbar";

const Agriculture: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState('2025-A');
  const [selectedCrop, setSelectedCrop] = useState('all');

  // Mock data
  const overviewStats = {
    totalFarmers: 45620,
    cultivatedLand: 28450,
    seasonalProduction: 125400,
    cooperatives: 156,
  };

  const cropsData = [
    { name: 'Maize', production: 45200, target: 48000, yield: 2.8, area: 16142 },
    { name: 'Beans', production: 32100, target: 35000, yield: 1.9, area: 16894 },
    { name: 'Cassava', production: 28800, target: 30000, yield: 12.5, area: 2304 },
    { name: 'Sweet Potato', production: 19500, target: 22000, yield: 8.9, area: 2191 },
    { name: 'Rice', production: 15200, target: 18000, yield: 4.2, area: 3619 },
  ];

  const seasonalTrends = [
    { month: 'Sep', seasonA: 32, seasonB: 0, seasonC: 15 },
    { month: 'Oct', seasonA: 45, seasonB: 0, seasonC: 28 },
    { month: 'Nov', seasonA: 68, seasonB: 0, seasonC: 12 },
    { month: 'Dec', seasonA: 85, seasonB: 0, seasonC: 5 },
    { month: 'Jan', seasonA: 92, seasonB: 0, seasonC: 0 },
    { month: 'Feb', seasonA: 78, seasonB: 12, seasonC: 0 },
  ];

  const challenges = [
    {
      issue: 'Climate Change Impact',
      severity: 'high',
      affectedFarmers: 12450,
      locations: ['Kinyinya', 'Jabana'],
      recommendation: 'Deploy drought-resistant seed varieties and establish irrigation systems in affected areas. Coordinate with meteorology services for early warning systems.',
    },
    {
      issue: 'Seed Quality',
      severity: 'medium',
      affectedFarmers: 8200,
      locations: ['Remera', 'Gisozi'],
      recommendation: 'Strengthen quality control measures and establish certified seed distribution centers. Partner with agricultural research institutes.',
    },
    {
      issue: 'Market Access',
      severity: 'medium',
      affectedFarmers: 6800,
      locations: ['Kimironko'],
      recommendation: 'Develop market linkage programs and improve rural road infrastructure. Establish collection centers and negotiate with buyers.',
    },
  ];

  const cooperatives = [
    {
      name: 'COOPAGRI Kinyinya',
      members: 245,
      crops: ['Maize', 'Beans'],
      performance: 87,
      revenue: 2450000,
    },
    {
      name: 'COOPAGRI Remera',
      members: 189,
      crops: ['Rice', 'Vegetables'],
      performance: 92,
      revenue: 3200000,
    },
    {
      name: 'COOPAGRI Kimironko',
      members: 156,
      crops: ['Cassava', 'Sweet Potato'],
      performance: 78,
      revenue: 1800000,
    },
  ];

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="mb-4">
            <div className="bg-white rounded-lg px-6 py-6 w-full flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 text-[#099773]">Agriculture Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Monitor agricultural performance and support farmer development
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mt-4 md:mt-0">
                <div className="flex items-center space-x-2">
                  <label htmlFor="season" className="text-sm font-medium text-gray-700"></label>
                  <select
                    id="season"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-[#099773] focus:ring-[#099773] sm:text-sm"
                  >
                    <option value="2025-A">Season A 2025</option>
                    <option value="2024-C">Season C 2024</option>
                    <option value="2024-B">Season B 2024</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <label className="text-sm font-medium text-gray-700"></label>
                  <span className="text-base font-semibold text-[#137775]">Kinyinya Sector</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Statistics - Metric Card Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Farmers */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 min-h-[120px]">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#137775] shadow-lg">
                    <UsersIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Total Farmers</h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">{overviewStats.totalFarmers.toLocaleString()}</div>
                <div className="flex items-center text-xs">
                  <span className="font-medium text-green-600">+3.2%</span>
                  <span className="text-gray-500 ml-1">Since last month</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-[#099773] opacity-20"></div>
              </div>
            </div>
            {/* Cultivated Land */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 min-h-[120px]">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#F89D2D] shadow-lg">
                    <MapPinIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Cultivated Land</h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">{overviewStats.cultivatedLand.toLocaleString()} Ha</div>
                <div className="flex items-center text-xs">
                  <span className="font-medium text-green-600">+1.8%</span>
                  <span className="text-gray-500 ml-1">Since last month</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-[#F89D2D] opacity-20"></div>
              </div>
            </div>
            {/* Seasonal Production */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 min-h-[120px]">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#099773] shadow-lg">
                    <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Seasonal Production</h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">{overviewStats.seasonalProduction.toLocaleString()} MT</div>
                <div className="flex items-center text-xs">
                  <span className="font-medium text-green-600">+8.5%</span>
                  <span className="text-gray-500 ml-1">Since last month</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-[#099773] opacity-20"></div>
              </div>
            </div>
            {/* Cooperatives */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 min-h-[120px]">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#144c49] shadow-lg">
                    <ChartBarIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Cooperatives</h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">{overviewStats.cooperatives}</div>
                <div className="flex items-center text-xs">
                  <span className="font-medium text-green-600">+2.1%</span>
                  <span className="text-gray-500 ml-1">Since last month</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-[#144c49] opacity-20"></div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crop Production vs Targets */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Crop Production vs Targets
              </h3>
              <div className="overflow-auto max-h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cropsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="production" fill="#099773" name="Actual Production" />
                    <Bar dataKey="target" fill="#F89D2D" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Seasonal Activity Calendar */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Seasonal Activity Calendar
              </h3>
              <div className="overflow-auto max-h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={seasonalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="seasonA"
                      stackId="1"
                      stroke="#099773"
                      fill="#099773"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="seasonB"
                      stackId="1"
                      stroke="#F89D2D"
                      fill="#F89D2D"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="seasonC"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Challenges & AI Recommendations - Alternating Card Colors */}
          <div className="py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center text-[#099773]">Current Challenges & AI Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {challenges.map((challenge, index) => {
                const isColored = index === 1; 
                return (
                  <div
                    key={index}
                    className={`rounded-2xl shadow-lg flex flex-col items-center p-8 min-h-[320px] ${isColored ? 'bg-[#099773]' : 'bg-white border'}`}
                  >
                    {/* Icon placeholder - you can use a relevant icon here */}
                    <div className="mb-4">
                      <svg width="40" height="40" fill="none" stroke={isColored ? '#fff' : '#099773'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                        <circle cx="20" cy="20" r="18" />
                        <path d="M20 10v8M20 28h.01" />
                      </svg>
                    </div>
                    <h4 className={`font-bold text-lg mb-2 text-center ${isColored ? 'text-white' : 'text-[#099773]'}`}>{challenge.issue}</h4>
                    <p className={`${isColored ? 'text-white' : 'text-gray-700'} text-sm mb-2 text-center`}>
                      Affecting {challenge.affectedFarmers.toLocaleString()} farmers in {challenge.locations.join(', ')}
                    </p>
                    <div className={`${isColored ? 'text-white' : 'text-gray-700'} text-sm mb-4 text-center`}>
                      <span className="font-semibold">AI Recommendation:</span> {challenge.recommendation}
                    </div>
                    <button
                      className={`mt-auto px-6 py-2 rounded shadow font-semibold transition ${isColored ? 'bg-white text-[#099773] hover:bg-gray-100' : 'bg-[#099773] text-white hover:bg-[#0f5e5a]'}`}
                    >
                      Details
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Agriculture; 