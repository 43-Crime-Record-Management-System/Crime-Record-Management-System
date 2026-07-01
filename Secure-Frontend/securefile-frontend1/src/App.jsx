import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./auth/Login";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";

import OfficerLayout from "./layouts/OfficerLayout";
import SHOLayout from "./layouts/SHOLayout";
import AdminLayout from "./layouts/AdminLayout";
import { RecordsProvider } from "./context/RecordsContext";

import OfficerDashboard from "./pages/officer/OfficerDashboard";
import FIRPortal from "./pages/officer/FIRPortal";
import FIRRegister from "./pages/officer/FIRRegister";
import FIRSuccess from "./pages/officer/FIRSuccess";
import CaseDiary from "./pages/officer/CaseDiary";
import CriminalRecords from "./pages/officer/CriminalRecords";
import CourtHearings from "./pages/officer/CourtHearings";
import CaseList from "./pages/officer/CaseList";
import OfficerFIRFullView from "./pages/officer/FIRFullView";

import Notifications from "./pages/notification/Notifications";
import Settings from "./pages/Settings/Settings";

import SHODashboard from "./pages/sho/SHODashboard";
import FIRApprovals from "./pages/sho/FIRApprovals";
import CaseAssignment from "./pages/sho/CaseAssignment";
import CaseMonitoring from "./pages/sho/CaseMonitoring";
import OfficerPerformance from "./pages/sho/OfficerPerformance";
import FirFullView from "./pages/sho/FirFullView";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import SystemAudit from "./pages/admin/SystemAudit";
import AlertDetails from "./pages/admin/AlertDetails";
import PersonnelOverview from "./pages/admin/PersonnelOverview";
function App() {
  const { loading, user } = useAuth();
  if (loading) return <p>Loading...</p>;

  return (
    <RecordsProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* ... existing routes ... */}
        <Route path="/dashboard/*"
          element={
            <RequireAuth>
              {user?.role === "ADMIN" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <RequireRole allowedRoles={["OFFICER"]}>
                  <OfficerLayout />
                </RequireRole>
              )}
            </RequireAuth>
          }
        >
          <Route index element={<OfficerDashboard />} />
          <Route path="fir" element={<FIRPortal />} />
          <Route path="fir/register" element={<FIRRegister />} />
          <Route path="fir/success" element={<FIRSuccess />} />
          <Route path="fir/:firId" element={<OfficerFIRFullView />} />
          <Route path="criminals" element={<CriminalRecords />} />
          <Route path="cases" element={<CaseList />} />
          <Route path="cases/:caseId" element={<CaseDiary />} />
          <Route path="court-hearings" element={<CourtHearings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route
          path="/sho"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["SHO"]}>
                <SHOLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<SHODashboard />} />
          <Route path="fir-approvals" element={<FIRApprovals />} />
          <Route path="case-assignment" element={<CaseAssignment />} />
          <Route path="case-monitoring" element={<CaseMonitoring />} />
          <Route path="performance" element={<OfficerPerformance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="fir/:firId" element={<FirFullView />} />
        </Route>
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="audit" element={<SystemAudit />} />
          <Route path="personnel" element={<PersonnelOverview />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route
            path="/admin/alert-details"
            element={<AlertDetails />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RecordsProvider>
  );
}

export default App;
