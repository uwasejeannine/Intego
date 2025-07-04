import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@/hooks/useMediaQuery";
import { fetchUsers, fetchRoles } from "@/lib/api/api";
import type { Role } from "@/types/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Users, 
  UserCheck, 
  UserX, 
  DollarSign, 
  Info,
  User,
  Edit,
  Trash2
} from "lucide-react";

export interface Project {
  id: number;
  latestTotalBudgetSpending: number;
  cumulativeAchievements: number;
}

const AdminDashboard: React.FC = () => {
  const { first_name } = useAuthStore();
  const [, setUsers] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<any[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const navigate = useNavigate();

  useEffect(() => {
    const getUserStats = async () => {
      try {
        const users = await fetchUsers();
        setUsers(users);
        const total = users.length;
        const active = users.filter((u: any) => u.status === "Active").length;
        const inactive = users.filter((u: any) => u.status === "Inactive").length;
        setUserStats({ total, active, inactive });
        setRecentUsers(users.slice(0, 4));
        // Group registrations by month for the line chart
        const regByMonth: { [key: string]: number } = {};
        users.forEach((u: any) => {
          const date = new Date(u.createdAt);
          const month = date.toLocaleString("default", { month: "short" });
          regByMonth[month] = (regByMonth[month] || 0) + 1;
        });
        setUserRegistrations(
          Object.entries(regByMonth).map(([month, count]) => ({ month, count }))
        );
      } catch (error) {
        setUserStats({ total: 0, active: 0, inactive: 0 });
        setRecentUsers([]);
        setUserRegistrations([]);
      }
    };
    const getRoles = async () => {
      try {
        const roles = await fetchRoles();
        setRoles(roles);
      } catch (error) {
        setRoles([]);
      }
    };
    getUserStats();
    getRoles();
  }, []);

  const pieData = [
    { name: "Active", value: userStats.active },
    { name: "Inactive", value: userStats.inactive },
  ];
  const pieColors = ["#137775", "#ef4444"];

  // Stat Card Component
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ComponentType<any>;
    trend?: number;
    color: string;
  }> = ({ title, value, subtitle, icon: Icon, trend }) => {
    return (
      <Card className="cards dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
              <p className="text-2xl font-bold text-[#137775]">{value}</p>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            <div className="p-3 bg-[#e6f4f2] dark:bg-[#1a3b2e] rounded-lg">
              <Icon className="h-6 w-6 text-[#137775]" />
            </div>
          </div>
          {trend !== undefined && trend !== 0 && (
            <div className="mt-4 flex items-center">
              <Info className="h-4 w-4 text-[#137775] mr-1" />
              <span className="text-sm text-[#137775]">{Math.abs(trend)}% vs last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
      <main className={`${!isMobile ? "pt-[80px] pl-[250px] pr-[20px]" : "w-full py-20 px-2"} min-h-screen overflow-auto`}>
        <div className="flex flex-col items-center space-y-6 max-w-full px-4">
          {/* Header Section */}
          <div className="w-full max-w-full">
            <Card className="flex w-full justify-center items-center justify-items-center mb-5 dark:bg-slate-700">
              <CardHeader className="font-bold text-lg">
              {`Welcome, ${first_name} - Admin Dashboard`}
                <p className="mt-1 text-sm text-gray-500 font-normal">
                Monitor user statistics and system activity
                </p>
              </CardHeader>
            </Card>
          </div>

          {/* Overview Statistics */}
          <div className="w-full max-w-full">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
              title="Total Users"
              value={userStats.total}
              subtitle="All users in the system"
              icon={Users}
              color="#137775"
              />
              <StatCard
              title="Active Users"
              value={userStats.active}
              subtitle="Active accounts"
              icon={UserCheck}
              color="#137775"
              />
              <StatCard
              title="Inactive Users"
              value={userStats.inactive}
              subtitle="Inactive accounts"
              icon={UserX}
              color="#ef4444"
              />
              <StatCard
              title="Revenue"
              value={"$3,345"}
              subtitle="This month"
              icon={DollarSign}
              color="#137775"
              />
            </div>
          </div>

          {/* Charts Section */}
          <div className="w-full max-w-full grid gap-6 grid-cols-1 lg:grid-cols-2 px-2 relative z-0">
          {/* User Status Pie Chart */}
            <Card className="p-4 dark:bg-slate-800 relative w-full z-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                User Status
                </CardTitle>
              </CardHeader>
            <CardContent className="relative p-2 z-0 flex flex-col items-center">
              <PieChart width={220} height={220}>
                <Pie
                  data={pieData}
                  cx={110}
                  cy={110}
                  innerRadius={60}
                  outerRadius={90}
                  fill="#137775"
                  paddingAngle={2}
                  dataKey="value"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex flex-col items-center mt-2">
                <span className="font-bold text-2xl text-[#137775]">{userStats.total} Users</span>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center text-sm"><span className="w-3 h-3 rounded-full bg-[#137775] inline-block mr-1"></span>Active</span>
                  <span className="flex items-center text-sm"><span className="w-3 h-3 rounded-full bg-[#ef4444] inline-block mr-1"></span>Inactive</span>
                </div>
                </div>
              </CardContent>
            </Card>

          {/* User Registrations Line Chart */}
            <Card className="p-4 dark:bg-slate-800 relative w-full z-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                User Registrations
                </CardTitle>
              </CardHeader>
              <CardContent className="relative p-2 z-0">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={userRegistrations} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                      <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#137775" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
                  </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

        {/* Recent Users Table */}
        <Card className="w-full max-w-full dark:bg-slate-800 mt-6">
            <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-w-full">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sector of Operation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentUsers.map((user, idx) => (
                    <tr key={user.id || idx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{idx + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.first_name} {user.last_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-[#e6f4f2] text-[#137775]' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{user.sectorofOperations || ''}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {(() => {
                          const role = roles.find((r) => String(r.id) === String(user.roleId));
                          return role ? role.name : "";
                        })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="5" r="1.5" fill="#137775"/>
                                <circle cx="12" cy="12" r="1.5" fill="#137775"/>
                                <circle cx="12" cy="19" r="1.5" fill="#137775"/>
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                              <User className="mr-2 h-4 w-4 text-primary" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                              <Edit className="mr-2 h-4 w-4 text-primary" /> Update
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {/* TODO: Implement delete user logic */}} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
  );
};

export default AdminDashboard;