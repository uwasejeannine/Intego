import React from "react";
import Dashboard from "@/components/dashboard/dashboard";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "@/views/DistrictAdministrator/Navigation/sidebar-menu";

const DistrictAdministratorDashboardPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <DistrictAdministratorSidebar />
      <Dashboard user="districtAdministrator" />
    </>
  );
};

export default DistrictAdministratorDashboardPage;