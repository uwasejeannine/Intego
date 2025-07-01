import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navigation/main-navbar";
import SectorCoordinatorSidebar from "@/views/SectorCoordinator/Navigation/sidebar-menu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:3000/api/v1/farmers/individual/";

const EditFarmer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFarmer();
    // eslint-disable-next-line
  }, [id]);

  const fetchFarmer = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}${id}`);
      const data = await res.json();
      setForm(data?.data || data);
    } catch (e) {
      setForm(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        primary_crops: Array.isArray(form.primary_crops) ? form.primary_crops : (typeof form.primary_crops === 'string' && form.primary_crops.startsWith('[') ? JSON.parse(form.primary_crops) : form.primary_crops.split(',').map((c: string) => c.trim())),
      };
      await fetch(`${API_URL}${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      navigate(`/sector-coordinator/farmers/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="pt-32 pl-[250px]">Loading...</div>;
  if (!form) return <div className="pt-32 pl-[250px]">Farmer not found.</div>;

  return (
    <>
      <Navbar />
      <SectorCoordinatorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 pt-24 min-h-screen">
        <div className="max-w-2xl mx-auto mt-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Edit Farmer</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input name="first_name" placeholder="First Name" value={form.first_name || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <input name="last_name" placeholder="Last Name" value={form.last_name || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <input name="email" placeholder="Email" value={form.email || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <input name="phone" placeholder="Phone" value={form.phone || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <input name="region_id" placeholder="Region ID" value={form.region_id || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <input name="address" placeholder="Address" value={form.address || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <input name="farm_location" placeholder="Farm Location" value={form.farm_location || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <input name="total_farm_area_hectares" type="number" placeholder="Total Farm Area (Ha)" value={form.total_farm_area_hectares || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <input name="years_experience" type="number" placeholder="Years Experience" value={form.years_experience || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <select name="farmer_type" value={form.farmer_type || 'commercial'} onChange={handleChange} required className="w-full border rounded p-2">
                <option value="commercial">Commercial</option>
                <option value="subsistence">Subsistence</option>
              </select>
              <input name="primary_crops" placeholder="Primary Crops (comma separated)" value={Array.isArray(form.primary_crops) ? form.primary_crops.join(', ') : form.primary_crops || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <input name="registration_date" type="date" value={form.registration_date && typeof form.registration_date === 'string' && form.registration_date.includes('T') ? form.registration_date.slice(0, 10) : form.registration_date || ''} onChange={handleChange} required className="w-full border rounded p-2" />
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </>
  );
};

export default EditFarmer; 