import { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "../../Navigation/sidebar-menu";
import { DataTable } from "@/components/tables/farmers/data-table";
import { columns } from "@/components/tables/farmers/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";
import { fetchSectors, fetchSectorsByDistrict } from "@/lib/api/api";
import { Sector } from "@/types/types";

const API_URL = "http://localhost:3000/api/v1/farmers/individual/";
const COOP_API_URL = "http://localhost:3000/api/v1/farmers/cooperatives";

const COOP_COLUMNS = [
  { 
    accessorKey: "cooperative_name", 
    header: () => <div className="text-center">Name</div>, 
    cell: ({ row }: any) => <div className="text-center">{row.original.cooperative_name || "-"}</div> 
  },
  { 
    accessorKey: "location", 
    header: () => <div className="text-center">Location</div>, 
    cell: ({ row }: any) => <div className="text-center">{row.original.location || "-"}</div> 
  },
  { 
    accessorKey: "number_of_farmers", 
    header: () => <div className="text-center"># Farmers</div>, 
    cell: ({ row }: any) => <div className="text-center">{row.original.number_of_farmers || 0}</div> 
  },
  { 
    accessorKey: "main_crops", 
    header: () => <div className="text-center">Main Crops</div>, 
    cell: ({ row }: any) => {
      const crops = row.original.main_crops || row.original.mainCropsArray;
      let display = "-";
      
      if (Array.isArray(crops)) {
        display = crops.length > 0 ? crops.join(", ") : "-";
      } else if (typeof crops === 'string' && crops.startsWith('[')) {
        try {
          const arr = JSON.parse(crops);
          if (Array.isArray(arr)) display = arr.length > 0 ? arr.join(", ") : "-";
        } catch {
          display = crops || "-";
        }
      } else if (crops) {
        display = crops;
      }
      
      return <div className="text-center">{display}</div>;
    } 
  },
  { 
    accessorKey: "region_id", 
    header: () => <div className="text-center">Region</div>, 
    cell: ({ row }: any) => <div className="text-center">{row.original.region?.region_name || row.original.region_id || "-"}</div> 
  },
  { 
    accessorKey: "is_active", 
    header: () => <div className="text-center">Active</div>, 
    cell: ({ row }: any) => <div className="text-center">{row.original.is_active ? "Yes" : "No"}</div> 
  },
];

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [coopList, setCoopList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'individual' | 'cooperative'>('individual');
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedCoopSector, setSelectedCoopSector] = useState<string | null>(null);
  const { district_id, token, userId } = useAuthStore();

  // Create authenticated headers
  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  useEffect(() => {
    // Only fetch data if we have authentication
    if (token && userId) {
      fetchFarmers();
      fetchCooperatives();
      if (district_id) {
        loadSectors(district_id);
      }
    }
  }, [district_id, token, userId]);

  const loadSectors = async (districtId: number) => {
    try {
      const filteredSectors = await fetchSectorsByDistrict(districtId);
      setSectors(filteredSectors);
    } catch (e) {
      console.error('Error fetching sectors:', e);
      setSectors([]);
    }
  };

  const fetchFarmers = async (sectorId: string | null = null) => {
    if (!token || !userId) {
      console.warn('No authentication token available');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let url = API_URL;
      if (sectorId) {
        url += `?sector_id=${sectorId}`;
      }
      
      const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setFarmers(data?.data || data || []);
    } catch (e) {
      console.error('Error fetching farmers:', e);
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCooperatives = async (sectorId: string | null = null) => {
    if (!token || !userId) {
      console.warn('No authentication token available');
      return;
    }

    try {
      let url = COOP_API_URL;
      if (sectorId) {
        url += `?sector_id=${sectorId}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCoopList(data?.data || data || []);
    } catch (e) {
      console.error('Error fetching cooperatives:', e);
      setCoopList([]);
    }
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    if (value === 'all') {
      fetchFarmers(null);
    } else {
      fetchFarmers(value);
    }
  };

  const handleCoopSectorChange = (value: string) => {
    setSelectedCoopSector(value);
    if (value === 'all') {
      fetchCooperatives(null);
    } else {
      fetchCooperatives(value);
    }
  };

  // Show loading or unauthorized message if no auth
  if (!token || !userId) {
    return (
      <>
        <Navbar />
        <DistrictAdministratorSidebar />
        <main className="pl-[250px] pr-[20px] pt-20 bg-gray-50 min-h-screen">
          <div className="space-y-6 py-6">
            <Card className="w-full p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
              <p className="text-gray-600">Please log in to view farmers data.</p>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <DistrictAdministratorSidebar />
      <main className="pl-[250px] pr-[20px] pt-20 bg-gray-50 min-h-screen">
        <div className="space-y-6 py-6">
          <Tabs value={tab} onValueChange={value => setTab(value as 'individual' | 'cooperative')} className="w-full max-w-6xl">
            <Card className="h-[70px] w-full flex items-center pl-[30px] justify-between">
              <TabsList className="w-full flex gap-4 justify-start">
                <TabsTrigger value="individual">Individual Farmers</TabsTrigger>
                <TabsTrigger value="cooperative">Cooperatives</TabsTrigger>
              </TabsList>
              {tab === 'individual' && (
                <div className="pr-4">
                  <Select onValueChange={handleSectorChange} value={selectedSector || ""}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {sectors.map(sector => (
                        <SelectItem key={sector.id} value={sector.id.toString()}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {tab === 'cooperative' && (
                <div className="pr-4">
                  <Select onValueChange={handleCoopSectorChange} value={selectedCoopSector || ""}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {sectors.map(sector => (
                        <SelectItem key={sector.id} value={sector.id.toString()}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </Card>
            <Card className="w-full dark:bg-slate-500">
              <TabsContent value="individual">
                <DataTable columns={columns} data={farmers} userType="districtAdmin" initialLoading={loading} scrollable />
              </TabsContent>
              <TabsContent value="cooperative">
                <DataTable columns={COOP_COLUMNS} data={coopList} userType="districtAdmin" initialLoading={loading} scrollable />
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default Farmers;