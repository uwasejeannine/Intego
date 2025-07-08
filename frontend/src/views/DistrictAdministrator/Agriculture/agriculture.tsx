import React, { useState, useEffect } from 'react';
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
  ResponsiveContainer,
  Cell,
} from 'recharts';
import DistrictAdministratorSidebar from "@/views/DistrictAdministrator/Navigation/sidebar-menu";
import { Navbar } from "@/components/navigation/main-navbar";
import { fetchFarmers, fetchCrops, fetchCooperatives } from '@/lib/api/api';

const Agriculture: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState('2025-A');
  const [farmers, setFarmers] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [cooperatives, setCooperatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchFarmers(),
      fetchCrops(),
      fetchCooperatives(),
    ]).then(([farmers, crops, cooperatives]) => {
      setFarmers(farmers);
      setCrops(crops);
      setCooperatives(cooperatives);
    }).finally(() => setLoading(false));
  }, []);

  // Overview stats
  const farmersArray = Array.isArray(farmers) ? farmers : [];
  const cropsArray = Array.isArray(crops) ? crops : [];
  const cooperativesArray = Array.isArray(cooperatives) ? cooperatives : [];

  // Calculate total cultivated land from farmers
  const cultivatedLand = farmersArray.reduce((sum, f) => sum + (Number(f.total_farm_area_hectares) || 0), 0);
  // Number of crops
  const numberOfCrops = Array.isArray(crops) ? crops.length : 0;
  // Average yield per hectare (from crops)
  const avgYield = cropsArray.length > 0 ? (
    cropsArray.reduce((sum, c) => sum + (Number(c.expected_yield_per_hectare) || 0), 0) / cropsArray.length
  ) : 0;
  // Overview stats for cards
  const overviewStats = {
    totalFarmers: farmersArray.length,
    cultivatedLand,
    numberOfCrops,
    avgYield,
    cooperatives: cooperativesArray.length,
  };

  // Yield per Hectare by Crop (top 5, colored)
  let yieldData = cropsArray.map((c: any) => ({
    name: c.crop_name,
    yield: Number(c.expected_yield_per_hectare) || 0,
  }));
  // Sort by yield descending, take top 5
  yieldData = yieldData.sort((a, b) => b.yield - a.yield).slice(0, 5);
  // Assign colors: top 4 get green/orange, lowest gets red
  const barColors = ['#137775', '#099773', '#084C3E', '#ef8f20', '#e01024'];

  // Data for Individual Farmers vs Cooperatives
  const farmersVsCoopsData = [
    { name: 'Individual Farmers', count: farmersArray.length },
    { name: 'Cooperatives', count: cooperativesArray.length },
  ];
  const farmersVsCoopsColors = ['#099773', '#ef8f20'];

  if (loading) {
    return <div className="p-12 text-center text-lg">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <DistrictAdministratorSidebar />
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
                <div className="mt-2 h-1 rounded-full bg-[#F89D2D] opacity-20"></div>
              </div>
            </div>
            {/* Number of Crops */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 min-h-[120px]">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#099773] shadow-lg">
                    <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Number of Crops</h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">{overviewStats.numberOfCrops}</div>
                <div className="mt-2 h-1 rounded-full bg-[#099773] opacity-20"></div>
              </div>
            </div>
            {/* Average Yield per Hectare */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 min-h-[120px]">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#144c49] shadow-lg">
                    <ChartBarIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Avg. Yield per Hectare</h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">{overviewStats.avgYield.toFixed(2)} T/Ha</div>
                <div className="mt-2 h-1 rounded-full bg-[#144c49] opacity-20"></div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Yield per Hectare by Crop */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Yield per Hectare by Crop
              </h3>
              <div className="overflow-auto max-h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={yieldData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis label={{ value: 'T/Ha', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="yield" name="Yield (T/Ha)">
                      {yieldData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index] || '#137775'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Individual Farmers vs Cooperatives Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Individual Farmers vs Cooperatives
              </h3>
              <div className="overflow-auto max-h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={farmersVsCoopsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" name="Count">
                      {farmersVsCoopsData.map((_, index) => (
                        <Cell key={`cell-coop-${index}`} fill={farmersVsCoopsColors[index] || '#099773'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Agriculture; 