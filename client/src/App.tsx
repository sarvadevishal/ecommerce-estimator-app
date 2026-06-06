import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppShell } from "./components/shell/AppShell";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CreatePage } from "./pages/CreatePage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SavedEstimatePage } from "./pages/SavedEstimatePage";
import { SettingsPage } from "./pages/SettingsPage";

const TITLES: Record<string, string> = {
  "/": "Create estimate",
  "/dashboard": "Dashboard",
  "/history": "History",
  "/settings": "Settings",
};

export default function App() {
  const { pathname } = useLocation();
  const title =
    TITLES[pathname] ??
    (pathname.startsWith("/estimate/") ? "Estimate" : "Delivery Estimator");

  return (
    <AppShell title={title}>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/estimate/:id" element={<SavedEstimatePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </AppShell>
  );
}
