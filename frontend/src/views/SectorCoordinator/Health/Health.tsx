import React, { useState, useEffect } from 'react';
import {
  HeartIcon,
  BuildingOffice2Icon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
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

} from 'recharts';
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { Navbar } from "@/components/navigation/main-navbar";

const Health: React.FC = () => {
  const [, setOverviewStats] = useState({ totalPatients: 0, healthFacilities: 0, vaccinationRate: 0, maternalMortality: 0 });
  const [diseaseData, setDiseaseData] = useState<any[]>([]);
  const [vaccinationData, setVaccinationData] = useState<any[]>([]);
  const [healthFacilities, setHealthFacilities] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    // Fetch diseases
    fetch('http://localhost:3000/api/v1/diseases')
      .then(res => res.json())
      .then(data => {
        const diseases = Array.isArray(data) ? data : data.data || [];
        setDiseaseData(diseases.map((d: any) => ({
          name: d.name,
          cases: d.cases || 0,
          trend: d.trend || 0,
          severity: d.severity || 'medium',
        })));
        // Optionally, build monthlyTrends from diseases if available
      });
    // Fetch vaccines
    fetch('http://localhost:3000/api/v1/vaccines')
      .then(res => res.json())
      .then(data => {
        const vaccines = Array.isArray(data) ? data : data.data || [];
        setVaccinationData(vaccines.map((v: any) => ({
          name: v.name,
          coverage: v.coverage || 0,
          target: v.target || 0,
        })));
      });
    // Fetch health facilities
    fetch('http://localhost:3000/api/v1/hospital')
      .then(res => res.json())
      .then(data => {
        const facilities = Array.isArray(data) ? data : data.data || [];
        setHealthFacilities(facilities);
        const totalPatients = facilities.reduce((sum: number, f: any) => sum + (f.patients || 0), 0);
        setOverviewStats(prev => ({
          ...prev,
          totalPatients,
          healthFacilities: facilities.length
        }));
      });
    // Fetch patients and maternal mortality if you have endpoints, else keep as 0
    setLoading(false);
  }, []);

  // Optionally, aggregate overviewStats from fetched data
  // For demo, just use healthFacilities.length and vaccinationData average
  useEffect(() => {
    if (vaccinationData.length > 0) {
      const avgCoverage = Math.round(vaccinationData.reduce((sum, v) => sum + (v.coverage || 0), 0) / vaccinationData.length);
      setOverviewStats(prev => ({ ...prev, vaccinationRate: avgCoverage }));
    }
  }, [vaccinationData]);
  // Stat cards: Only show real data
  const totalVaccines = vaccinationData.length;
  const totalDiseases = diseaseData.length;
  const totalFacilities = healthFacilities.length;

  // For charts, show only the latest 3 diseases and latest 4 vaccines
  const latestDiseaseData = diseaseData.slice(-3);
  const latestVaccinationData = vaccinationData.slice(-4);

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="mb-4">
            <div className="bg-white rounded-lg px-6 py-6 w-full">
              <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Monitor public health indicators and healthcare service delivery</p>
            </div>
          </div>

          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Vaccines"
              value={totalVaccines}
              subtitle="Registered vaccines"
              icon={HeartIcon}
              trend={0}
              trendDirection="neutral"
              color="#137775"
              iconBg="#F89D2D"
            />
            <StatCard
              title="Total Diseases"
              value={totalDiseases}
              subtitle="Tracked diseases"
              icon={ExclamationTriangleIcon}
              trend={0}
              trendDirection="neutral"
              color="#ef8f20"
              iconBg="#ef8f20"
            />
            <StatCard
              title="Health Facilities"
              value={totalFacilities}
              subtitle="Active facilities"
              icon={BuildingOffice2Icon}
              trend={0}
              trendDirection="neutral"
              color="#137775"
              iconBg="#099773"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disease Trends */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Disease Trends
              </h3>
              {latestDiseaseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={latestDiseaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cases" fill="#137775" name="Cases" />
                </BarChart>
              </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-400 py-16">No disease data available</div>
              )}
            </div>

            {/* Vaccination Coverage */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vaccination Coverage vs Targets
              </h3>
              {latestVaccinationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={latestVaccinationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="coverage" fill="#ef8f20" name="Current Coverage" />
                  <Bar dataKey="target" fill="#099773" name="Target" />
                </BarChart>
              </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-400 py-16">No vaccination data available</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  trend: number;
  trendDirection: 'up' | 'down' | 'neutral';
  color: string;
  iconBg: string;
}> = ({ title, value, subtitle, icon: Icon, trend, trendDirection, color, iconBg }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-xl shadow-lg" style={{ background: iconBg }}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {trend !== 0 && (
        <div className="mt-4 flex items-center">
          {trendDirection === 'up' ? (
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
          ) : trendDirection === 'down' ? (
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
          ) : null}
          <span className={`text-sm ${
            trendDirection === 'up' ? 'text-green-600' : 
            trendDirection === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {Math.abs(trend)}% vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default Health; 