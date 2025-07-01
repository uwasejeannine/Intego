import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:3000/api/v1/farmers/individual/";

const ViewFarmer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmer();
    // eslint-disable-next-line
  }, [id]);

  const fetchFarmer = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}${id}`);
      const data = await res.json();
      setFarmer(data?.data || data);
    } catch (e) {
      setFarmer(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-32 pl-[250px]">Loading...</div>;
  if (!farmer) return <div className="pt-32 pl-[250px]">Farmer not found.</div>;

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24 min-h-screen">
        <div className="max-w-2xl mx-auto mt-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Farmer Details</h2>
            <div className="space-y-2">
              <div><b>Name:</b> {farmer.first_name} {farmer.last_name}</div>
              <div><b>Email:</b> {farmer.email}</div>
              <div><b>Phone:</b> {farmer.phone}</div>
              <div><b>Region:</b> {farmer.regionName || farmer.region_id}</div>
              <div><b>Address:</b> {farmer.address}</div>
              <div><b>Farm Location:</b> {farmer.farm_location}</div>
              <div><b>Total Farm Area (Ha):</b> {farmer.total_farm_area_hectares}</div>
              <div><b>Years Experience:</b> {farmer.years_experience}</div>
              <div><b>Farmer Type:</b> {farmer.farmer_type}</div>
              <div><b>Primary Crops:</b> {Array.isArray(farmer.primary_crops) ? farmer.primary_crops.join(", ") : farmer.primary_crops}</div>
              <div><b>Cooperative:</b> {farmer.cooperativeName || farmer.cooperative_id || "-"}</div>
              <div><b>Registration Date:</b> {farmer.registration_date && typeof farmer.registration_date === 'string' && farmer.registration_date.includes('T') ? farmer.registration_date.slice(0, 10) : farmer.registration_date}</div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => navigate(`/sector-coordinator/farmers/${id}/edit`)} className="bg-yellow-600 text-white">Edit</Button>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
};

export default ViewFarmer; 