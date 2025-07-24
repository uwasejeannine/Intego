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
  ResponsiveContainer,
} from 'recharts';
import DistrictAdministratorSidebar from "../Navigation/sidebar-menu";
import { Navbar } from "@/components/navigation/main-navbar";
import { fetchSchools, fetchStudents, fetchTeachers, fetchInfrastructures } from '@/lib/api/api';

const Education: React.FC = () => {
  const [schools, setSchools] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [infras, setInfras] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetchSchools(),
      fetchStudents(),
      fetchTeachers(),
      fetchInfrastructures(),
    ]).then(([schools, students, teachers, infras]) => {
      setSchools(schools);
      setStudents(students);
      setTeachers(teachers);
      setInfras(infras);
    });
  }, []);

  // Overview stats
  const overviewStats = {
    schools: schools.length,
    students: students.length,
    teachers: teachers.length,
    classrooms: infras.reduce((sum, i) => sum + (Number(i.classrooms) || 0), 0),
  };

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

  return (
    <>
      <Navbar />
      <DistrictAdministratorSidebar />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-8">
            {/* Gender Distribution */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Student Gender Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={genderData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="gender" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#137775" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Attendance Distribution */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Attendance Rate Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bucket" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#099773" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Infrastructure Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6 max-w-6xl mx-auto mt-8">
            <h2 className="text-lg font-semibold mb-4">Infrastructure Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {infrastructureData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-2xl font-bold" style={{ color: '#137775' }}>{item.value}</div>
                  <div className="text-sm text-gray-600 mb-1">{item.indicator}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-[#137775] h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                  <div className="text-xs text-gray-500">{item.percentage}% of schools</div>
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