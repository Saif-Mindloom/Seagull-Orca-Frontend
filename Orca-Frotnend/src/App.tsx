import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { LeadDetailsPage } from "./pages/LeadDetailsPage";
import { LeadsPipelinePage } from "./pages/LeadsPipelinePage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="dashboard">
        <Sidebar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/leads" element={<LeadsPipelinePage />} />
          <Route path="/leads/:leadId" element={<LeadDetailsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
