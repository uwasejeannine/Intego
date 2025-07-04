import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  HeartIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  MapPinIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const sectors = [
  { name: 'Agriculture', value: 'agriculture', icon: ChartBarIcon, href: '/district-admin/agriculture' },
  { name: 'Health', value: 'health', icon: HeartIcon, href: '/district-admin/health' },
  { name: 'Education', value: 'education', icon: AcademicCapIcon, href: '/district-admin/education' },
];

const quickLinks = [
  { name: 'Dashboard', href: '/district-admin/dashboard', icon: HomeIcon },
  { name: 'Alerts', href: '/district-admin/alerts', icon: ExclamationTriangleIcon },
];

type Sector = 'agriculture' | 'health' | 'education';

type SectorNavLink = { name: string; href: string; icon: React.ComponentType<any>; subItems?: SectorNavLink[] };

const sectorNav: Record<Sector, SectorNavLink[]> = {
  agriculture: [
    { name: 'Overview', href: '/district-admin/agriculture', icon: ChartBarIcon },
    { name: 'Farmers', href: '/district-admin/agriculture/farmers', icon: UsersIcon },
    { name: 'Crops', href: '/district-admin/agriculture/crops', icon: MapPinIcon },
    { name: 'Productivity', href: '/district-admin/agriculture/productivity', icon: ChartBarIcon },
    { name: 'Inputs', href: '#', icon: Bars3Icon, subItems: [
      { name: 'Seeds', href: '/district-admin/agriculture/inputs/seeds', icon: MapPinIcon },
      { name: 'Fertilizers', href: '/district-admin/agriculture/inputs/fertilizers', icon: MapPinIcon },
      { name: 'Pesticides/Chemicals', href: '/district-admin/agriculture/inputs/pesticides', icon: MapPinIcon },
    ]},
    { name: 'Market', href: '#', icon: Bars3Icon, subItems: [
      { name: 'Market Prices', href: '/district-admin/agriculture/market/prices', icon: ChartBarIcon },
    ]},
    { name: 'Weather Info', href: '/district-admin/agriculture/weather', icon: ExclamationTriangleIcon },
  ],
  health: [
    { name: 'Overview', href: '/district-admin/health', icon: HeartIcon },
    { name: 'Facilities', href: '/district-admin/health/facilities', icon: BuildingOffice2Icon },
    { name: 'Diseases', href: '/district-admin/health/diseases', icon: ExclamationTriangleIcon },
    { name: 'Vaccination', href: '/district-admin/health/vaccination', icon: UserGroupIcon },
  ],
  education: [
    { name: 'Overview', href: '/district-admin/education', icon: AcademicCapIcon },
    { name: 'Schools', href: '/district-admin/education/schools', icon: BuildingLibraryIcon },
    { name: 'Students', href: '/district-admin/education/students', icon: UsersIcon },
    { name: 'Teachers', href: '/district-admin/education/teachers', icon: UserGroupIcon },
    { name: 'Infrastructure', href: '/district-admin/education/infrastructure', icon: BuildingOffice2Icon },
    { name: 'Performance', href: '/district-admin/education/performance', icon: ChartBarIcon },
    { name: 'Dropouts', href: '/district-admin/education/dropouts', icon: ExclamationTriangleIcon },
  ],
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  let currentSector: Sector | null = null;
  if (location.pathname.startsWith('/district-admin/agriculture') || location.pathname === '/district-admin/farmers') {
    currentSector = 'agriculture';
  } else if (location.pathname.startsWith('/district-admin/health')) {
    currentSector = 'health';
  } else if (location.pathname.startsWith('/district-admin/education')) {
    currentSector = 'education';
  }

  useEffect(() => {
    if (currentSector && selectedSector !== currentSector) {
      setSelectedSector(currentSector);
    }
  }, [currentSector, selectedSector]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSectorDropdownOpen(false);
      }
    }
    if (sectorDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sectorDropdownOpen]);

  const handleSectorSelect = (sector: Sector) => {
    setSelectedSector(sector);
    setSectorDropdownOpen(false);
    navigate(sectors.find(s => s.value === sector)?.href || '/district-admin/dashboard');
  };

  const handleSubmenuToggle = (name: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="fixed left-0 top-[60px] bg-white h-[calc(100vh-70px)] w-60 flex flex-col shadow-lg border-r border-gray-200 z-40">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            {quickLinks.map(link => (
              <button
                key={link.name}
                onClick={() => navigate(link.href)}
                className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  location.pathname === link.href
                    ? 'bg-[#137775] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <link.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                {link.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sectors Dropdown */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Sectors
          </h3>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setSectorDropdownOpen(!sectorDropdownOpen)}
              className="group flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <div className="flex items-center">
                <Bars3Icon className="flex-shrink-0 h-5 w-5 mr-3" />
                <span>
                  {selectedSector 
                    ? sectors.find(s => s.value === selectedSector)?.name 
                    : 'Select Sector'
                  }
                </span>
              </div>
              <svg 
                className={`h-4 w-4 transition-transform ${sectorDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {sectorDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {sectors.map(sector => (
                  <button
                    key={sector.value}
                    onClick={() => handleSectorSelect(sector.value as Sector)}
                    className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                      selectedSector === sector.value
                        ? 'bg-[#137775] text-white hover:bg-[#137775]'
                        : 'text-gray-700'
                    }`}
                  >
                    <sector.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                    {sector.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sector Navigation - Show when dropdown is open OR when currently on a sector page */}
        {selectedSector && (sectorDropdownOpen || currentSector) && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {selectedSector.charAt(0).toUpperCase() + selectedSector.slice(1)} Navigation
            </h3>
            <div className="space-y-1">
              {sectorNav[selectedSector].map((link: SectorNavLink) =>
                link.subItems ? (
                  <div key={link.name}>
                    <button
                      onClick={() => handleSubmenuToggle(link.name)}
                      className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                        'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <link.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                      {link.name}
                      <svg
                        className={`ml-auto h-4 w-4 transition-transform ${openSubmenus[link.name] ? 'rotate-90' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {openSubmenus[link.name] && link.subItems && (
                      <div className="ml-6 mt-1 space-y-1">
                        {link.subItems.map((sub) => (
                          <button
                            key={sub.name}
                            onClick={() => navigate(sub.href)}
                            className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                              location.pathname === sub.href
                                ? 'bg-[#137775] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <sub.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.href)}
                    className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      location.pathname === link.href
                        ? 'bg-[#137775] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <link.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                    {link.name}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;