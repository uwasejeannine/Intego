import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import ErrorBoundary, { NotFoundPage } from "./ErrorPage";
import React, { Suspense } from "react";
import Logo from "@/assets/logo.svg";
import { Icons } from "./components/ui/icons";
import { useAuthStore } from "./stores/authStore";
import ForbiddenPage from "./ForbiddenPage";

const LoadingUI = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-black dark:text-white">
      <img
        src={Logo}
        alt="logo"
        className="h-40 w-40 flex items-center justify-center"
      />
      <div className="flex items-center justify-center flex-col p-5">
        <h1 className="font-bold text-2xl">MINAGRI</h1>
        <p className="text-lg">Project Tracker System</p>
      </div>
      <div>
        <Icons.spinner className="animate-spin text-primary dark:text-white" />
      </div>
    </div>
  );
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SectorCoordinatorRoutes = React.lazy(() =>
  delay(1000).then(() =>
    import("./routes").then((module) => ({
      default: module.SectorCoordinatorRoutes,
    })),
  ),
);
const DistrictAdministratorRoutes = React.lazy(() =>
  delay(1000).then(() =>
    import("./routes").then((module) => ({
      default: module.DistrictAdministratorRoutes,
    })),
  ),
);
const AdminRoutes = React.lazy(() =>
  delay(1000).then(() =>
    import("./routes").then((module) => ({
      default: module.AdminRoutes,
    })),
  ),
);
const AuthenticationRoutes = React.lazy(() =>
  delay(1000).then(() =>
    import("./routes").then((module) => ({
      default: module.AuthenticationRoutes,
    })),
  ),
);

function App() {
  const { isAuthenticated, userType } = useAuthStore();

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Suspense fallback={<LoadingUI />}>
        <ErrorBoundary theme="light">
          <div className="min-h-screen">
            <Toaster />
            <Router>
              <Routes>
                <Route
                  path="sector-coordinator/*"
                  element={
                    isAuthenticated && userType === "sectorCoordinator" ? (
                      <SectorCoordinatorRoutes />
                    ) : (
                      <Navigate to="/auth/login" replace />
                    )
                  }
                />
                <Route
                  path="district-admin/*"
                  element={
                    isAuthenticated && userType === "districtAdministrator" ? (
                      <DistrictAdministratorRoutes />
                    ) : (
                      <Navigate to="/auth/login" replace />
                    )
                  }
                />
                <Route
                  path="admin/*"
                  element={
                    isAuthenticated && userType === "admin" ? (
                      <AdminRoutes />
                    ) : (
                      <Navigate to="/auth/login" replace />
                    )
                  }
                />
                <Route path="auth/*" element={<AuthenticationRoutes />} />
                <Route
                  path="/"
                  element={
                    !isAuthenticated ? (
                      <Navigate to="/auth/login" replace />
                    ) : userType === "sectorCoordinator" ? (
                      <Navigate to="/sector-coordinator/overview" replace />
                    ) : userType === "districtAdministrator" ? (
                      <Navigate to="/district-admin/overview" replace />
                    ) : userType === "admin" ? (
                      <Navigate to="/admin/overview" replace />
                    ) : (
                      <Navigate to="/auth/login" replace />
                    )
                  }
                />
                <Route path="*" element={<AuthenticationRoutes />} />
              </Routes>
            </Router>
          </div>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;