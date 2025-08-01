import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import ErrorBoundary from "./ErrorPage";
import React, { Suspense } from "react";
import Logo from "@/assets/logo.svg";
import { Icons } from "./components/ui/icons";
import { useAuthStore } from "./stores/authStore";

const LoadingUI = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-black dark:text-white">
      <img
        src={Logo}
        alt="logo"
        className="h-40 w-40 flex items-center justify-center"
      />
      <div className="flex items-center justify-center flex-col p-5">
        <h1 className="font-bold text-2xl">Local Goverment</h1>
        <p className="text-lg">Intego360</p>
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
    <Router>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Suspense fallback={<LoadingUI />}>
        <ErrorBoundary theme="light">
          <div className="min-h-screen">
            <Toaster />
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
                      <Navigate to="/sector-coordinator/dashboard" replace />
                    ) : userType === "districtAdministrator" ? (
                      <Navigate to="/district-admin/dashboard" replace />
                    ) : userType === "admin" ? (
                      <Navigate to="/admin/dashboard" replace />
                    ) : (
                      <Navigate to="/auth/login" replace />
                    )
                  }
                />
                <Route path="*" element={<AuthenticationRoutes />} />
              </Routes>
          </div>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
    </Router>
  );
}

export default App;