import React from 'react';
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { Navbar } from "@/components/navigation/main-navbar";

const Alerts: React.FC = () => {
  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4 text-[#137775]">Alerts</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-700">This is the Alerts page. Here you will see all system alerts and notifications relevant to your sectors.</p>
            {/* TODO: Implement alerts listing and filtering here */}
          </div>
        </div>
      </main>
    </>
  );
};

export default Alerts;
