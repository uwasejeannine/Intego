import React from "react";
import Dashboard from "@/components/dashboard/dashboard";
import { Navbar } from "@/components/navigation/main-navbar";
import AdminSidebar from "../Navigation/sidebar-menu";

const AdminDashboardPage: React.FC = () => {
  return (
    <>
      <Navbar className="z-[1]" />
      <AdminSidebar />
      <Dashboard />
    </>
  );
};

export default AdminDashboardPage;