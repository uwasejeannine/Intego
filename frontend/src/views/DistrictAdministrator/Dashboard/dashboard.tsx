import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/main-navbar";
import DistrictAdministratorSidebar from "@/views/DistrictAdministrator/Navigation/sidebar-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { api } from "@/lib/api/api"; // ✅ Use the configured API instance instead of axios
import { Users, Leaf, Stethoscope, School, AlertCircle, MapPin, ChevronDown } from "lucide-react";

// ✅ Use relative paths since api instance already has baseURL configured
const API_FARMERS = "/farmers/individual/";
const API_COOPS = "/farmers/cooperatives";
const API_HEALTH = "/hospital";
const API_SCHOOLS = "/schools";
const API_CROPS = "/crops";
const API_USER_PROFILE = "/user/profile"; // Add user profile endpoint

const COLORS = ["#137775", "#099773", "#ef8f20"];

// Rwanda Districts for fallback
const RWANDA_DISTRICTS = [
  "Nyarugenge", "Kicukiro", "Gasabo", "Nyanza", "Gicumbi", "Rulindo",
  "Gakenke", "Musanze", "Burera", "Rwabihu", "Rubavu", "Ngororero",
  "Rusizi", "Nyamasheke", "Karongi", "Rutsiro", "Kayonza", "Rwamagana",
  "Nyagatare", "Gatsibo", "Kirehe", "Ngoma", "Bugesera", "Ruhango",
  "Muhanga", "Kamonyi", "Huye", "Nyaruguru", "Gisagara", "Nyamagabe"
];

// Sectors mapping for different districts - based on official Rwanda administrative divisions
const DISTRICT_SECTORS: Record<string, string[]> = {
  // Kigali City
  "Gasabo": [
    "Bumbogo", "Gatsata", "Gikomero", "Gisozi", "Jabana", "Jali", "Kacyiru", 
    "Kimihurura", "Kimironko", "Kinyinya", "Nduba", "Ndera", "Remera", "Rusororo", "Rutunga"
  ],
  "Kicukiro": [
    "Gahanga", "Gatenga", "Gikondo", "Kagarama", "Kanombe", "Kicukiro", 
    "Kibagabaga", "Kigarama", "Masaka", "Niboye", "Nyarugunga"
  ],
  "Nyarugenge": [
    "Gitega", "Kanyinya", "Kigali", "Kimisagara", "Mageragere", "Muhima", 
    "Nyakabanda", "Nyamirambo", "Nyarugenge", "Rwezamenyo"
  ],
  
  // Northern Province
  "Burera": [
    "Butaro", "Cyeru", "Cyanika", "Gahunga", "Gatebe", "Gitovu", "Kivuye", 
    "Kinoni", "Nemba", "Rugari", "Rugarama", "Ruhunde", "Rusarabuye", "Rwerere"
  ],
  "Gakenke": [
    "Busengo", "Coko", "Cyabingo", "Gakenke", "Gashenyi", "Janja", "Kamubuga", 
    "Karambo", "Kivuruga", "Mataba", "Minazi", "Muhondo", "Muyongwe", "Muzo", 
    "Nemba", "Ruli", "Rusasa", "Rushashi"
  ],
  "Gicumbi": [
    "Bukure", "Bwisige", "Byumba", "Cyumba", "Giti", "Kaniga", "Manyagiro", 
    "Miyove", "Mukarange", "Muko", "Mutete", "Nyamiyaga", "Nyankenke I", 
    "Nyankenke II", "Rubaya", "Rukomo", "Rushaki", "Rutare", "Ruvune", "Shangasha"
  ],
  "Musanze": [
    "Busogo", "Cyuve", "Gacaca", "Gataraga", "Kimonyi", "Kinigi", "Muhoza", 
    "Muko", "Musanze", "Nkotsi", "Nyange", "Remera", "Rwaza", "Shingiro"
  ],
  "Rulindo": [
    "Base", "Burega", "Bushoki", "Buyoga", "Cyinzuzi", "Cyungo", "Kinihira", 
    "Kisaro", "Masoro", "Mbogo", "Murambi", "Ngoma", "Ntarabana", "Rusiga", 
    "Shyorongi", "Tumba"
  ],
  
  // Southern Province
  "Gisagara": [
    "Gikonko", "Gishubi", "Gisagara", "Kansi", "Kibilizi", "Kigembe", "Muganza", 
    "Mugombwa", "Mukindo", "Musha", "Ndora", "Nyanza", "Save"
  ],
  "Huye": [
    "Gishamvu", "Huye", "Karama", "Kinazi", "Maraba", "Mbazi", "Mukura", 
    "Ngoma", "Ruhashya", "Rusatira", "Rwaniro", "Simbi", "Tumba"
  ],
  "Kamonyi": [
    "Gacurabwenge", "Kayenzi", "Kayumbu", "Mugina", "Musambira", "Ngamba", 
    "Nyamiyaga", "Nyarubaka", "Rugalika", "Rukoma", "Runda"
  ],
  "Muhanga": [
    "Cyeza", "Kabacuzi", "Kibangu", "Kiyumba", "Muhanga", "Mushishiro", 
    "Nyabinoni", "Nyamabuye", "Nyarusange", "Rugendabari", "Shyogwe"
  ],
  "Nyamagabe": [
    "Buruhukiro", "Cyanika", "Gatare", "Kaduha", "Kamegeri", "Kibirizi", 
    "Kitabi", "Mbazi", "Mugano", "Musange", "Musebeya", "Nkomane", "Ruhashya", "Uwinkingi"
  ],
  "Nyanza": [
    "Busoro", "Cyabakamyi", "Gatagara", "Kigoma", "Mukingo", "Muyira", 
    "Ntyazo", "Nyagisozi", "Rwabicuma", "Rukali", "Rusatira", "Uwinkingi"
  ],
  "Nyaruguru": [
    "Busanze", "Cyahinda", "Kibeho", "Kivu", "Mata", "Muganza", "Munini", 
    "Ngera", "Ngoma", "Nyabimata", "Nyagisozi", "Ruheru", "Ruramba", "Rusenge"
  ],
  
  // Eastern Province
  "Bugesera": [
    "Gashora", "Juru", "Kamabuye", "Kibirizi", "Mareba", "Mayange", "Musenyi", 
    "Mwogo", "Ngeruka", "Ntarama", "Nyamata", "Nyarugenge", "Rilima", "Ruhuha", 
    "Rweru", "Shyara"
  ],
  "Gatsibo": [
    "Gasange", "Gatsibo", "Gitoki", "Kabarore", "Kageyo", "Kiramuruzi", 
    "Kiziguro", "Muhura", "Murambi", "Ngarama", "Nyagihanga", "Remera", 
    "Rugarama", "Rwimbogo"
  ],
  "Kayonza": [
    "Gahini", "Kabare", "Kabarondo", "Mukarange", "Murama", "Murundi", 
    "Mwiri", "Ndego", "Nyamirama", "Rukara", "Ruramira", "Rwinkwavu"
  ],
  "Kirehe": [
    "Gahara", "Gatore", "Kigarama", "Kigina", "Mahama", "Mpanga", "Musaza", 
    "Mushikiri", "Nasho", "Nyarubuye", "Nyamugari", "Nyankora"
  ],
  "Ngoma": [
    "Gashanda", "Jarama", "Karembo", "Kibungo", "Mugesera", "Murama", 
    "Mutenderi", "Remera", "Rukira", "Rukumberi", "Rurenge", "Sake", "Zaza"
  ],
  "Nyagatare": [
    "Gatunda", "Karama", "Karangazi", "Katabagemu", "Kiyombe", "Matimba", 
    "Mimuri", "Musheri", "Nyagatare", "Rukomo", "Rwempasha", "Rwimiyaga", "Tabagwe"
  ],
  "Rwamagana": [
    "Fumbwe", "Gahengeri", "Gishari", "Karenge", "Kigabiro", "Muhazi", 
    "Muyumbu", "Mwulire", "Munyiginya", "Nzige", "Rubona"
  ],
  
  // Western Province
  "Karongi": [
    "Bwishyura", "Gashari", "Gishyita", "Gitesi", "Murambi", "Mutuntu", 
    "Mubuga", "Rwankuba", "Rubengera", "Rugabano", "Twumba"
  ],
  "Ngororero": [
    "Bwira", "Gatumba", "Hindiro", "Kabaya", "Kageyo", "Kavumu", "Matyazo", 
    "Muhanda", "Ngororero", "Nyange", "Sovu"
  ],
  "Nyabihu": [
    "Bigogwe", "Jenda", "Jomba", "Kabatwa", "Karago", "Kintobo", "Mukamira", 
    "Mulinga", "Rambura", "Rugera", "Rurembo", "Shyira"
  ],
  "Nyamasheke": [
    "Bushekeri", "Bushenge", "Cyato", "Gihombo", "Kagano", "Kanjongo", 
    "Karambi", "Karengera", "Kirimbi", "Macuba", "Mahembe", "Nyabitekeri", 
    "Rangiro", "Ruharambuga", "Shangi"
  ],
  "Rubavu": [
    "Bugeshi", "Busasamana", "Cyanzarwe", "Gisenyi", "Kanama", "Kanzenze", 
    "Mudende", "Nyakiriba", "Nyamyumba", "Nyundo", "Rubavu"
  ],
  "Rusizi": [
    "Bugarama", "Butare", "Bweyeye", "Gihundwe", "Gikundamvura", "Gitambi", 
    "Kamembe", "Muganza", "Mururu", "Nkombo", "Nkanka", "Nyakabuye", "Nzahaha", "Rwimbogo"
  ],
  "Rutsiro": [
    "Boneza", "Gihango", "Kigeyo", "Kivumu", "Manihira", "Mukura", "Murunda", 
    "Mushonyi", "Musasa", "Nyabirasi", "Ruhango", "Rusebeya"
  ],
  
  // Add fallback sectors for any district not listed above
  "default": ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"]
};

// Types for better type safety
interface Farmer {
  id: number;
  first_name: string;
  last_name: string;
  // Add other farmer properties as needed
}

interface Cooperative {
  id: number;
  cooperative_name: string;
  // Add other cooperative properties as needed
}

interface HealthFacility {
  id: number;
  name: string;
  // Add other health facility properties as needed
}

interface School {
  id: number;
  school_name: string;
  // Add other school properties as needed
}

interface Crop {
  id: number;
  crop_name: string;
  // Add other crop properties as needed
}

interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  name?: string;
  district?: string | null;
  // Add other user properties as needed
}

// Function to get random district
const getRandomDistrict = () => {
  const randomIndex = Math.floor(Math.random() * RWANDA_DISTRICTS.length);
  return RWANDA_DISTRICTS[randomIndex];
};

// Function to get sectors for a district
const getSectorsForDistrict = (district: string): string[] => {
  return DISTRICT_SECTORS[district] || DISTRICT_SECTORS["default"];
};

const DistrictAdministratorDashboardPage: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [healthFacilities, setHealthFacilities] = useState<HealthFacility[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userDistrict, setUserDistrict] = useState<string | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Starting to fetch dashboard data...');
        
        // ✅ Use Promise.allSettled instead of Promise.all to handle partial failures
        const results = await Promise.allSettled([
          api.get(API_FARMERS),
          api.get(API_COOPS),
          api.get(API_CROPS),
          api.get(API_HEALTH),
          api.get(API_SCHOOLS),
          api.get(API_USER_PROFILE), // Fetch user profile
        ]);

        // Handle farmers data
        if (results[0].status === 'fulfilled') {
          const farmersData = results[0].value.data;
          setFarmers(farmersData?.data || farmersData || []);
          console.log('✅ Farmers data loaded:', farmersData?.data?.length || 0);
        } else {
          console.error('❌ Failed to fetch farmers:', results[0].reason);
          setFarmers([]);
        }

        // Handle cooperatives data
        if (results[1].status === 'fulfilled') {
          const coopsData = results[1].value.data;
          setCooperatives(coopsData?.data || coopsData || []);
          console.log('✅ Cooperatives data loaded:', coopsData?.data?.length || 0);
        } else {
          console.error('❌ Failed to fetch cooperatives:', results[1].reason);
          setCooperatives([]);
        }

        // Handle crops data
        if (results[2].status === 'fulfilled') {
          const cropsData = results[2].value.data;
          setCrops(cropsData?.data || cropsData || []);
          console.log('✅ Crops data loaded:', cropsData?.data?.length || 0);
        } else {
          console.error('❌ Failed to fetch crops:', results[2].reason);
          setCrops([]);
        }

        // Handle health facilities data
        if (results[3].status === 'fulfilled') {
          const healthData = results[3].value.data;
          setHealthFacilities(healthData?.data || healthData || []);
          console.log('✅ Health facilities data loaded:', healthData?.data?.length || 0);
        } else {
          console.error('❌ Failed to fetch health facilities:', results[3].reason);
          setHealthFacilities([]);
        }

        // Handle schools data
        if (results[4].status === 'fulfilled') {
          const schoolsData = results[4].value.data;
          setSchools(schoolsData?.data || schoolsData || []);
          console.log('✅ Schools data loaded:', schoolsData?.data?.length || 0);
        } else {
          console.error('❌ Failed to fetch schools:', results[4].reason);
          setSchools([]);
        }

        // Handle user profile data
        if (results[5].status === 'fulfilled') {
          const userData = results[5].value.data;
          const userInfo = userData?.data || userData || null;
          setUser(userInfo);
          
          // Set user district - use existing data or generate random fallback
          if (userInfo?.district) {
            setUserDistrict(userInfo.district);
          } else {
            // Generate random district if user doesn't have one
            const randomDistrict = getRandomDistrict();
            setUserDistrict(randomDistrict);
          }
          
          console.log('✅ User data loaded:', userInfo);
        } else {
          console.error('❌ Failed to fetch user profile:', results[5].reason);
          // Set fallback user and random district
          setUser(null);
          setUserDistrict(getRandomDistrict());
        }

        // Check if any requests failed
        const failedRequests = results.filter(result => result.status === 'rejected');
        if (failedRequests.length > 0) {
          console.warn(`⚠️ ${failedRequests.length} out of 6 requests failed`);
          setError(`Some data could not be loaded. ${failedRequests.length} requests failed.`);
        }

      } catch (err: any) {
        console.error('❌ Unexpected error fetching data:', err);
        setError(err.message || 'Failed to load dashboard data');
        
        // Set empty arrays as fallback
        setFarmers([]);
        setCooperatives([]);
        setCrops([]);
        setHealthFacilities([]);
        setSchools([]);
        setUser(null);
        setUserDistrict(getRandomDistrict());
      } finally {
        setLoading(false);
        console.log('🏁 Data fetching completed');
      }
    };

    fetchData();
  }, []);

  // Update available sectors when district changes
  useEffect(() => {
    if (userDistrict) {
      const sectors = getSectorsForDistrict(userDistrict);
      setAvailableSectors(sectors);
      // Select all sectors by default
      setSelectedSectors(sectors);
    }
  }, [userDistrict]);

  // Mock sector performance data - generate dynamic data based on available sectors
  const generateSectorData = (sectors: string[]) => {
    return sectors.slice(0, 8).map(sector => ({
      name: sector,
      agriculture: Math.floor(Math.random() * 30) + 70, // 70-100 range
      health: Math.floor(Math.random() * 25) + 75, // 75-100 range
      education: Math.floor(Math.random() * 20) + 80, // 80-100 range
    }));
  };

  // Filter sectors data based on selection
  const sectorsData = selectedSectors.length > 0 
    ? generateSectorData(selectedSectors) 
    : generateSectorData(availableSectors);

  const performanceData = [
    { name: "Agriculture", value: 78, color: COLORS[0] },
    { name: "Health", value: 87, color: COLORS[1] },
    { name: "Education", value: 91, color: COLORS[2] },
  ];

  const alerts = [
    {
      id: 1,
      type: "critical",
      sector: "Health",
      message: `Malaria cases increased by 15% in ${userDistrict || 'Nyarugenge'} district`,
      time: "2 hours ago",
      priority: "high" as const,
    },
    {
      id: 2,
      type: "warning",
      sector: "Agriculture",
      message: "Drought conditions affecting 3 sectors",
      time: "4 hours ago",
      priority: "medium" as const,
    },
    {
      id: 3,
      type: "info",
      sector: "Education",
      message: `New school construction completed in ${userDistrict || 'Gasabo'} district`,
      time: "1 day ago",
      priority: "low" as const,
    },
  ];

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return ` ${user.first_name} ${user.last_name}`;
    } else if (user?.name) {
      return ` ${user.name}`;
    } else if (user?.first_name) {
      return ` ${user.first_name}`;
    } else {
      return "";
    }
  };

  // Handle sector selection
  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => {
      if (prev.includes(sector)) {
        return prev.filter(s => s !== sector);
      } else {
        return [...prev, sector];
      }
    });
  };

  const handleSelectAllSectors = () => {
    setSelectedSectors(availableSectors);
  };

  const handleDeselectAllSectors = () => {
    setSelectedSectors([]);
  };

  return (
    <>
      <Navbar className="z-[1]" />
      <DistrictAdministratorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center space-y-6 max-w-full px-4 pt-24">
          {/* Error Alert */}
          {error && (
            <div className="w-full max-w-6xl border-yellow-200 bg-yellow-50 border rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
              <p className="text-yellow-700 text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Welcome Section with Sector Selection */}
          <div className="bg-[#137775] rounded-lg shadow-lg p-6 text-white w-full max-w-6xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left side - Welcome content */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  Welcome to {userDistrict || 'Nyarugenge'} District{getUserDisplayName()}!
                </h1>
                <p className="text-primary-100 mt-2">
                  Local Government Dashboard
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm">System Status: Operational</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-sm">{alerts.length} Active Alerts</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-sm">
                      District: {userDistrict || 'Nyarugenge'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - Sector Selection */}
              <div className="lg:w-80">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Sector Filter</span>
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {selectedSectors.length}/{availableSectors.length}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowSectorDropdown(!showSectorDropdown)}
                      className="w-full bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 text-left text-sm flex items-center justify-between transition-colors"
                    >
                      <span>
                        {selectedSectors.length === availableSectors.length 
                          ? 'All Sectors Selected'
                          : selectedSectors.length === 0
                          ? 'No Sectors Selected'  
                          : `${selectedSectors.length} Sectors Selected`
                        }
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showSectorDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showSectorDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-900 rounded-lg shadow-lg border max-h-64 overflow-y-auto z-10">
                        <div className="p-2 border-b flex gap-2">
                          <button
                            onClick={handleSelectAllSectors}
                            className="text-xs px-2 py-1 bg-[#137775] text-white rounded hover:bg-[#0f5f5d] transition-colors"
                          >
                            Select All
                          </button>
                          <button
                            onClick={handleDeselectAllSectors}
                            className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="p-1">
                          {availableSectors.map((sector) => (
                            <label
                              key={sector}
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSectors.includes(sector)}
                                onChange={() => handleSectorToggle(sector)}
                                className="w-4 h-4 text-[#137775] border-gray-300 rounded focus:ring-[#137775]"
                              />
                              <span>{sector}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            <MetricCard
              title="Total Farmers"
              value={Number(farmers?.length || 0).toLocaleString()}
              subtitle={selectedSectors.length > 0 ? `In ${selectedSectors.length} selected sectors` : "All farmers in the system"}
              color="green"
              icon={<Leaf className="w-5 h-5" style={{ color: '#099773' }} />}
            />
            <MetricCard
              title="Total Cooperatives"
              value={Number(cooperatives?.length || 0).toLocaleString()}
              subtitle={selectedSectors.length > 0 ? `In ${selectedSectors.length} selected sectors` : "All cooperatives in the system"}
              color="blue"
              icon={<Users className="w-5 h-5" style={{ color: '#137775' }} />}
            />
            <MetricCard
              title="Health Facilities"
              value={Number(healthFacilities?.length || 0).toLocaleString()}
              subtitle={selectedSectors.length > 0 ? `In ${selectedSectors.length} selected sectors` : "All levels"}
              color="red"
              icon={<Stethoscope className="w-5 h-5" style={{ color: '#ef8f20' }} />}
            />
            <MetricCard
              title="Schools"
              value={Number(schools?.length || 0).toLocaleString()}
              subtitle={selectedSectors.length > 0 ? `In ${selectedSectors.length} selected sectors` : "All levels"}
              color="purple"
              icon={<School className="w-5 h-5" style={{ color: '#137775' }} />}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
            {/* Sector Performance Overview */}
            <Card className="bg-white rounded-lg shadow-sm border p-6">
              <CardHeader>
                <CardTitle>
                  Sector Performance Overview
                  {selectedSectors.length > 0 && selectedSectors.length < availableSectors.length && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({selectedSectors.length} sectors shown)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="agriculture" fill="#137775" name="Agriculture" />
                    <Bar dataKey="health" fill="#099773" name="Health" />
                    <Bar dataKey="education" fill="#ef8f20" name="Education" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card className="bg-white rounded-lg shadow-sm border p-6">
              <CardHeader>
                <CardTitle>Overall Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          {/* Recent Alerts and Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
            {/* Recent Alerts */}
            <Card className="bg-white rounded-lg shadow-sm border p-6">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        alert.priority === "high"
                          ? "bg-red-50 border border-red-200"
                          : alert.priority === "medium"
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <span className={`h-5 w-5 mt-0.5 rounded-full ${
                        alert.priority === "high"
                          ? "bg-red-500"
                          : alert.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {alert.sector} • {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button className="w-full text-center text-sm text-[#137775] hover:text-[#0f5f5d] font-medium transition-colors">
                    View all alerts →
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="bg-white rounded-lg shadow-sm border p-6">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#137775] rounded-full mt-2"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Added new farmer registration</p>
                      <p className="text-xs text-gray-500">Today, 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#137775] rounded-full mt-2"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Updated health facility data</p>
                      <p className="text-xs text-gray-500">Yesterday, 3:15 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#137775] rounded-full mt-2"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Added new school construction</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#099773] rounded-full mt-2"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Updated cooperative information</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#ef8f20] rounded-full mt-2"></span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">System maintenance completed</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full text-center text-sm text-[#137775] hover:text-[#0f5f5d] font-medium transition-colors">
                    View all activities →
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
}> = ({ title, value, subtitle, color, icon }) => {
  const colorClasses: Record<string, string> = {
    blue: "text-[#137775] bg-blue-100",
    green: "text-green-600 bg-green-100",
    red: "text-red-600 bg-red-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {Number(value || 0).toLocaleString()}
          </div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DistrictAdministratorDashboardPage;