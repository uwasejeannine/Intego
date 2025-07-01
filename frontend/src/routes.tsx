import { Route, Routes, Navigate } from "react-router-dom";

// SectorCoordinator routes
import SectorCoordinatorUpdateProfilePage from "@/views/SectorCoordinator/Profile/update-profile";
import SectorCoordinatorOverviewPage from "@/views/SectorCoordinator/Overview/overview";
import SectorCoordinatorDashboardPage from "./views/SectorCoordinator/Dashboard/dashboard";
import SectorCoordinatorReportsPage from "./views/SectorCoordinator/Reports/view-reports";
import SectorCoordinatorReportDetailsPage from "./views/SectorCoordinator/Reports/report-details";
import Agriculture from "./views/SectorCoordinator/Dashboard/Agriculture";
import Health from "./views/SectorCoordinator/Dashboard/Health";
import Education from "./views/SectorCoordinator/Dashboard/Education";
import Alerts from "./views/SectorCoordinator/Notifications/notifications";
import ProductivityPage from "./views/SectorCoordinator/Agriculture/productivity";
import InputsSeedsPage from "./views/SectorCoordinator/Agriculture/inputs/seeds";
import InputsFertilizersPage from "./views/SectorCoordinator/Agriculture/inputs/fertilizers";
import InputsPesticidesPage from "./views/SectorCoordinator/Agriculture/inputs/pesticides";
import MarketPricesPage from "./views/SectorCoordinator/Agriculture/market/prices";
import WeatherInfoPage from "./views/SectorCoordinator/Agriculture/weather";
import FarmersPage from "./views/SectorCoordinator/Agriculture/Farmers/farmers";
import CropsPage from "./views/SectorCoordinator/Agriculture/Crops/crops";

// DistrictAdministrator routes
import DistrictAdministratorOverviewPage from "./views/DistrictAdministrator/Overview/overview";
import DistrictAdministratorUpdateProfilePage from "./views/DistrictAdministrator/Profile/update-profile";
import DistrictAdministratorReportsPage from "./views/DistrictAdministrator/Reports/view-reports";
import DistrictAdministratorDashboardPage from "./views/DistrictAdministrator/Dashboard/dashboard";
import DistrictAdministratorReportDetailsPage from "./views/DistrictAdministrator/Reports/report-details";

// Admin routes
import UserViewPage from "./views/Admin/Users/user-view";
import AddUserPage from "./views/Admin/Users/add-user";
import AdminOverviewPage from "./views/Admin/Overview/overview";
import AuthenticationPage from "./views/Authentication/authentication";
import { NotFoundPage } from "./ErrorPage";
import AdminUpdateProfilePage from "./views/Admin/Profile/update-profile";
import { useAuthStore } from "./stores/authStore";
import ForbiddenPage from "./ForbiddenPage";
import UpdateUserPage from "./views/Admin/Users/update-user";
import RolesManagementPage from "./views/Admin/Roles/roles-management";
import AdminDashboardPage from "./views/Admin/Dashboard/dashboard";

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
      <Route path="education" element={<Education />} />
      <Route path="alerts" element={<Alerts />} />
      <Route path="overview" element={<SectorCoordinatorOverviewPage />} />
      <Route path="reports-view" element={<SectorCoordinatorReportsPage />} />
      <Route path="report/:id" element={<SectorCoordinatorReportDetailsPage />} />
      <Route path="update-profile" element={<SectorCoordinatorUpdateProfilePage />} />
      <Route path="*" element={<AuthenticationPage />} />
    </Routes>
  );
};

const DistrictAdministratorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="overview" element={<DistrictAdministratorOverviewPage />} />
      <Route path="dashboard" element={<DistrictAdministratorDashboardPage />} />
      <Route path="reports-view" element={<DistrictAdministratorReportsPage />} />
      <Route
        path="report/:id"
        element={<DistrictAdministratorReportDetailsPage />}
      />
      <Route
        path="update-profile"
        element={<DistrictAdministratorUpdateProfilePage />}
      />
      <Route path="*" element={<AuthenticationPage />} />
    </Routes>
  );
};

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="overview" element={<AdminOverviewPage />} />
      <Route path="add-user" element={<AddUserPage />} />
      <Route path="users-view" element={<UserViewPage />} />
      <Route path="update-profile" element={<AdminUpdateProfilePage />} />
      <Route path="users/:id" element={<UpdateUserPage />} />
      <Route path="roles-management" element={<RolesManagementPage />} />
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