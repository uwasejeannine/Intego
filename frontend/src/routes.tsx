import { Route, Routes, Navigate } from "react-router-dom";

// SectorCoordinator routes
import SectorCoordinatorUpdateProfilePage from "@/views/SectorCoordinator/Profile/update-profile";
import SectorCoordinatorDashboardPage from "./views/SectorCoordinator/Dashboard/dashboard";
import Agriculture from "./views/SectorCoordinator/Dashboard/Agriculture";
import Health from "./views/SectorCoordinator/Health/Health";
import Education from "./views/SectorCoordinator/Education/Education";
import Alerts from "./views/SectorCoordinator/Notifications/notifications";
import ProductivityPage from "./views/SectorCoordinator/Agriculture/productivity";
import InputsSeedsPage from "./views/SectorCoordinator/Agriculture/inputs/seeds";
import InputsFertilizersPage from "./views/SectorCoordinator/Agriculture/inputs/fertilizers";
import InputsPesticidesPage from "./views/SectorCoordinator/Agriculture/inputs/pesticides";
import MarketPricesPage from "./views/SectorCoordinator/Agriculture/market/prices";
import WeatherInfoPage from "./views/SectorCoordinator/Agriculture/weather";
import FarmersPage from "./views/SectorCoordinator/Agriculture/Farmers/farmers";
import CropsPage from "./views/SectorCoordinator/Agriculture/Crops/crops";
import Facilities from "./views/SectorCoordinator/Health/Facilities";
import Diseases from "./views/SectorCoordinator/Health/Diseases";
import Vaccination from "./views/SectorCoordinator/Health/Vaccination";
import SchoolsPage from "./views/SectorCoordinator/Education/Schools";
import TeachersPage from "./views/SectorCoordinator/Education/Teachers";
import StudentsPage from "./views/SectorCoordinator/Education/Students";
import InfrastructurePage from "./views/SectorCoordinator/Education/Infrastructure";
import PerformancePage from "./views/SectorCoordinator/Education/Performance";
import DropoutsPage from "./views/SectorCoordinator/Education/Dropouts";

// DistrictAdministrator routes
import DistrictAdministratorUpdateProfilePage from "./views/DistrictAdministrator/Profile/update-profile";
import DistrictAdministratorDashboardPage from "./views/DistrictAdministrator/Dashboard/dashboard";
import DA_Alerts from "./views/DistrictAdministrator/Notifications/Alerts";
import DA_Education from "./views/DistrictAdministrator/Education/Education";
import DA_Schools from "./views/DistrictAdministrator/Education/Schools";
import DA_Students from "./views/DistrictAdministrator/Education/Students";
import DA_Teachers from "./views/DistrictAdministrator/Education/Teachers";
import DA_Health from "./views/DistrictAdministrator/Health/Health";
import DA_Facilities from "./views/DistrictAdministrator/Health/Facilities";
import DA_Diseases from "./views/DistrictAdministrator/Health/Diseases";
import DA_Vaccination from "./views/DistrictAdministrator/Health/Vaccination";
import DA_AgricultureOverview from "./views/DistrictAdministrator/Agriculture/agriculture";
import DA_Crops from "./views/DistrictAdministrator/Agriculture/Crops/crops";
import DA_Farmers from "./views/DistrictAdministrator/Agriculture/Farmers/farmers";
import DA_Infrastructure from "./views/DistrictAdministrator/Education/Infrastructure";
import DA_Dropouts from "./views/DistrictAdministrator/Education/Dropouts";
import DA_Performance from "./views/DistrictAdministrator/Education/Performance";
import DA_Weather from "./views/DistrictAdministrator/Agriculture/weather";
import DA_Seeds from "./views/DistrictAdministrator/Agriculture/inputs/seeds";
import DA_Fertilizers from "./views/DistrictAdministrator/Agriculture/inputs/fertilizers";
import DA_Pesticides from "./views/DistrictAdministrator/Agriculture/inputs/pesticides";
import DA_MarketPrices from "./views/DistrictAdministrator/Agriculture/market/prices";
import DA_Productivity from "./views/DistrictAdministrator/Agriculture/productivity";

// Admin routes
import UserViewPage from "./views/Admin/Users/user-view";
import AddUserPage from "./views/Admin/Users/add-user";
import AuthenticationPage from "./views/Authentication/authentication";
import AdminUpdateProfilePage from "./views/Admin/Profile/update-profile";
import { useAuthStore } from "./stores/authStore";
import UpdateUserPage from "./views/Admin/Users/update-user";
import RolesManagementPage from "./views/Admin/Roles/roles-management";
import AdminDashboardPage from "./views/Admin/Dashboard/dashboard";
import TermsAndConditions from "./views/Admin/TermsAndConditions";

const AuthenticationRoutes: React.FC = () => {
  const { isAuthenticated, userType } = useAuthStore();

  let userPath = "";
  switch (userType) {
    case "sectorCoordinator":
      userPath = "sector-coordinator/dashboard";
      break;
    case "districtAdministrator":
      userPath = "district-admin/dashboard";
      break;
    case "admin":
      userPath = "admin/dashboard";
      break;
    default:
      userPath = "auth/login";
      break;
  }

  return (
    <Routes>
      <Route
        path="login"
        element={
          !isAuthenticated ? (
            <AuthenticationPage />
          ) : (
            <Navigate to={`/${userPath}`} replace />
          )
        }
      />
      <Route
        path="forgot-password"
        element={
          !isAuthenticated ? (
            <AuthenticationPage />
          ) : (
            <Navigate to={`/${userPath}`} replace />
          )
        }
      />
      <Route
        path="verify-email"
        element={
          !isAuthenticated ? (
            <AuthenticationPage />
          ) : (
            <Navigate to={`/${userPath}`} replace />
          )
        }
      />
      <Route
        path="verification-code"
        element={
          !isAuthenticated ? (
            <AuthenticationPage />
          ) : (
            <Navigate to={`/${userPath}`} replace />
          )
        }
      />
      <Route
        path="reset-password"
        element={
          !isAuthenticated ? (
            <AuthenticationPage />
          ) : (
            <Navigate to={`/${userPath}`} replace />
          )
        }
      />
      <Route path="*" element={<AuthenticationPage />} />
    </Routes>
  );
};

const SectorCoordinatorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<SectorCoordinatorDashboardPage />} />
      <Route path="agriculture" element={<Agriculture />} />
      <Route path="agriculture/productivity" element={<ProductivityPage />} />
      <Route path="agriculture/inputs/seeds" element={<InputsSeedsPage />} />
      <Route path="agriculture/inputs/fertilizers" element={<InputsFertilizersPage />} />
      <Route path="agriculture/inputs/pesticides" element={<InputsPesticidesPage />} />
      <Route path="agriculture/market/prices" element={<MarketPricesPage />} />
      <Route path="agriculture/weather" element={<WeatherInfoPage />} />
      <Route path="agriculture/farmers" element={<FarmersPage />} />
      <Route path="agriculture/crops" element={<CropsPage />} />
      <Route path="health" element={<Health />} />
      <Route path="health/facilities" element={<Facilities />} />
      <Route path="health/diseases" element={<Diseases />} />
      <Route path="health/vaccination" element={<Vaccination />} />
      <Route path="education" element={<Education />} />
      <Route path="education/schools" element={<SchoolsPage />} />
      <Route path="education/teachers" element={<TeachersPage />} />
      <Route path="education/students" element={<StudentsPage />} />
      <Route path="education/infrastructure" element={<InfrastructurePage />} />
      <Route path="education/performance" element={<PerformancePage />} />
      <Route path="education/dropouts" element={<DropoutsPage />} />
      <Route path="alerts" element={<Alerts />} />
      <Route path="update-profile" element={<SectorCoordinatorUpdateProfilePage />} />
      <Route path="*" element={<AuthenticationPage />} />
    </Routes>
  );
};

const DistrictAdministratorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DistrictAdministratorDashboardPage />} />
      <Route path="alerts" element={<DA_Alerts />} />
      <Route path="update-profile" element={<DistrictAdministratorUpdateProfilePage />} />
      <Route path="education" element={<DA_Education />} />
      <Route path="education/schools" element={<DA_Schools />} />
      <Route path="education/students" element={<DA_Students />} />
      <Route path="education/teachers" element={<DA_Teachers />} />
      <Route path="health" element={<DA_Health />} />
      <Route path="health/facilities" element={<DA_Facilities />} />
      <Route path="health/diseases" element={<DA_Diseases />} />
      <Route path="health/vaccination" element={<DA_Vaccination />} />
      <Route path="agriculture" element={<DA_AgricultureOverview />} />
      <Route path="agriculture/overview" element={<DA_AgricultureOverview />} />
      <Route path="agriculture/productivity" element={<DA_Productivity />} />
      <Route path="agriculture/crops" element={<DA_Crops />} />
      <Route path="agriculture/farmers" element={<DA_Farmers />} />
      <Route path="education/infrastructure" element={<DA_Infrastructure />} />
      <Route path="education/dropouts" element={<DA_Dropouts />} />
      <Route path="education/performance" element={<DA_Performance />} />
      <Route path="agriculture/weather" element={<DA_Weather />} />
      <Route path="agriculture/inputs/seeds" element={<DA_Seeds />} />
      <Route path="agriculture/inputs/fertilizers" element={<DA_Fertilizers />} />
      <Route path="agriculture/inputs/pesticides" element={<DA_Pesticides />} />
      <Route path="agriculture/market/prices" element={<DA_MarketPrices />} />
      <Route path="*" element={<AuthenticationPage />} />
    </Routes>
  );
};

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="add-user" element={<AddUserPage />} />
      <Route path="users-view" element={<UserViewPage />} />
      <Route path="update-profile" element={<AdminUpdateProfilePage />} />
      <Route path="users/:id" element={<UpdateUserPage />} />
      <Route path="roles-management" element={<RolesManagementPage />} />
      <Route path="terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="*" element={<AuthenticationPage />} />
    </Routes>
  );
};


export {
  AuthenticationRoutes,
  SectorCoordinatorRoutes,
  DistrictAdministratorRoutes,
  AdminRoutes,
};
