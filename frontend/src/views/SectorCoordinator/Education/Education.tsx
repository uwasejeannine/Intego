import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  UsersIcon,
  BuildingLibraryIcon,
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
} from 'recharts';
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { Navbar } from "@/components/navigation/main-navbar";
import { fetchSchools, fetchStudents, fetchTeachers, fetchInfrastructures, fetchPerformances } from '@/lib/api/api';

const Education: React.FC = () => {
  const [schools, setSchools] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [infras, setInfras] = useState<any[]>([]);
  const [performances, setPerformances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchSchools(),
      fetchStudents(),
      fetchTeachers(),
      fetchInfrastructures(),
      fetchPerformances(),
    ]).then(([schools, students, teachers, infras, performances]) => {
      setSchools(schools);
      setStudents(students);
      setTeachers(teachers);
      setInfras(infras);
      setPerformances(performances);
    }).finally(() => setLoading(false));
  }, []);

  // Overview stats
  const overviewStats = {
    schools: schools.length,
    students: students.length,
    teachers: teachers.length,
    classrooms: infras.reduce((sum, i) => sum + (Number(i.classrooms) || 0), 0),
  };

  // Enrollment by level (example: count by level field if available)
  const enrollmentData = [
    { level: 'Primary', enrolled: students.filter(s => s.level === 'Primary').length, target: 0, rate: 0 },
    { level: 'Lower Secondary', enrolled: students.filter(s => s.level === 'Lower Secondary').length, target: 0, rate: 0 },
    { level: 'Upper Secondary', enrolled: students.filter(s => s.level === 'Upper Secondary').length, target: 0, rate: 0 },
    { level: 'TVET', enrolled: students.filter(s => s.level === 'TVET').length, target: 0, rate: 0 },
  ];

  // Performance by subject (example: group by subject)
  const perfBySubject: Record<string, { pass_rate: number[], national_avg: number[] }> = {};
  performances.forEach(p => {
    if (!perfBySubject[p.subject]) perfBySubject[p.subject] = { pass_rate: [], national_avg: [] };
    if (p.passRate) perfBySubject[p.subject].pass_rate.push(Number((p.passRate+'').replace('%','')));
    if (p.nationalAvg) perfBySubject[p.subject].national_avg.push(Number((p.nationalAvg+'').replace('%','')));
  });
  const performanceData = Object.entries(perfBySubject).map(([subject, arr]) => ({
    subject,
    pass_rate: arr.pass_rate.length ? (arr.pass_rate.reduce((a,b)=>a+b,0)/arr.pass_rate.length) : 0,
    national_avg: arr.national_avg.length ? (arr.national_avg.reduce((a,b)=>a+b,0)/arr.national_avg.length) : 0,
  }));

  // Infrastructure status
  const totalSchools = schools.length || 1;
  const infraIndicators = [
    {
      indicator: 'Schools with Electricity',
      value: infras.filter(i => (i.electricity || '').toLowerCase() === 'yes').length,
      total: totalSchools,
    },
    {
      indicator: 'Schools with Internet',
      value: infras.filter(i => (i.internet || '').toLowerCase() === 'yes').length,
      total: totalSchools,
    },
    {
      indicator: 'Schools with Library',
      value: infras.filter(i => (i.libraries && Number(i.libraries) > 0)).length,
      total: totalSchools,
    },
    {
      indicator: 'Schools with Sanitation',
      value: infras.filter(i => (i.latrines && Number(i.latrines) > 0)).length,
      total: totalSchools,
    },
  ];
  const infrastructureData = infraIndicators.map(item => ({
    ...item,
    percentage: Math.round((item.value / (item.total || 1)) * 100),
  }));

  // Chart 1: Student Gender Distribution
  const genderCounts: Record<string, number> = {};
  students.forEach(s => {
    const g = (s.gender || 'Unknown').toLowerCase();
    genderCounts[g] = (genderCounts[g] || 0) + 1;
  });
  const genderData = Object.entries(genderCounts).map(([gender, count]) => ({ gender: gender.charAt(0).toUpperCase() + gender.slice(1), count }));

  // Chart 2: Attendance Rate Distribution (by bucket)
  const attendanceBuckets = ['<60%', '60-70%', '70-80%', '80-90%', '90-100%'];
  const attendanceDist = [0, 0, 0, 0, 0];
  students.forEach(s => {
    const att = Number((s.attendance || '').toString().replace('%',''));
    if (att < 60) attendanceDist[0]++;
    else if (att < 70) attendanceDist[1]++;
    else if (att < 80) attendanceDist[2]++;
    else if (att < 90) attendanceDist[3]++;
    else attendanceDist[4]++;
  });
  const attendanceData = attendanceBuckets.map((bucket, i) => ({ bucket, count: attendanceDist[i] }));

  if (loading) {
    return <div className="p-12 text-center text-lg">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      {/* Added pt-20 for navbar height (py-[10px] + content + buffer) and min-h-screen for proper layout */}
      <main className="pl-[250px] pr-[20px] pt-20 bg-gray-50 min-h-screen">
        <div className="space-y-6 py-6">
          {/* Header */}
          <div className="flex w-full max-w-6xl justify-between items-center mb-4">
            <div className="bg-white rounded-lg px-6 py-6 w-full">
              <h1 className="text-2xl font-bold text-gray-900">Education Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Monitor education system performance and student outcomes</p>
            </div>
          </div>

          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Schools</p>
                  <p className="text-2xl font-bold" style={{ color: '#137775' }}>{overviewStats.schools}</p>
                  <p className="text-sm text-gray-500">All levels</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: '#137775' }}>
                  <BuildingLibraryIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold" style={{ color: '#099773' }}>{overviewStats.students.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Enrolled students</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: '#099773' }}>
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Teachers</p>
                  <p className="text-2xl font-bold" style={{ color: '#F89D2D' }}>{overviewStats.teachers.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Active teachers</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: '#F89D2D' }}>
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Classrooms</p>
                  <p className="text-2xl font-bold" style={{ color: '#e01024' }}>{overviewStats.classrooms}</p>
                  <p className="text-sm text-gray-500">All schools</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: '#e01024' }}>
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Student Gender Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={genderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="gender" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#137775" name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attendance Rate Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bucket" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#e01024" name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Infrastructure Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">School Infrastructure Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {infrastructureData.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{item.indicator}</h4>
                    <span className="text-lg font-bold text-blue-600">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.percentage >= 80 ? 'bg-green-500' :
                        item.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {item.value} out of {item.total} schools
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Education;