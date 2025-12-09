import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import SuperAdmin from "../../pages/superAdminDashboard/SuperAdmin";
import Members from "../../pages/superAdminDashboard/Members";
import CreateWhiteLabel from "../../pages/CreateWhiteLabel"
import Rolemanagement from "../../pages/superAdminDashboard/Rolemanagement"
import SchemeMaster from "../../pages/superAdminDashboard/SchemeMaster"
import RoleUpgrade from "../../pages/superAdminDashboard/RoleUpgrade"
import TaxHistory from "../../pages/superAdminDashboard/TaxHistory"
import ProtectedPermissionRoute from "../../components/ProtectedPermissionRoute";
import NotFound from "../../pages/notFound";

const SuperAdminDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={
          <ProtectedPermissionRoute>
            <SuperAdmin />
          </ProtectedPermissionRoute>
        } />
        <Route path="/home" element={
          <ProtectedPermissionRoute>
            <SuperAdmin />
          </ProtectedPermissionRoute>
        } />
        {/* Members routes with wildcard */}
        <Route path="/members/*" element={
          <Routes>
            <Route path="/" element={
              <ProtectedPermissionRoute>
                <Members />
              </ProtectedPermissionRoute>
            } />
            <Route path="/add" element={
              <ProtectedPermissionRoute requiredPermission="write">
                <CreateWhiteLabel />
              </ProtectedPermissionRoute>
            } />
            <Route path="/list" element={
              <ProtectedPermissionRoute>
                <Members />
              </ProtectedPermissionRoute>
            } />
            <Route path="/rolemanagement" element={
              <ProtectedPermissionRoute requiredPermission="write">
                <Rolemanagement />
              </ProtectedPermissionRoute>
            } />
            <Route path="*" element={
              <ProtectedPermissionRoute>
                <NotFound />
              </ProtectedPermissionRoute>
            } />
          </Routes>
        } />
        {/* Resources routes with wildcard */}
        <Route path="/resources/*" element={
          <Routes>
            <Route path="/schemamaster" element={
              <ProtectedPermissionRoute>
                <SchemeMaster />
              </ProtectedPermissionRoute>
            } />
            <Route path="/roleupgraderequest" element={
              <ProtectedPermissionRoute>
                <RoleUpgrade />
              </ProtectedPermissionRoute>
            } />
            <Route path="*" element={
              <ProtectedPermissionRoute>
                <NotFound />
              </ProtectedPermissionRoute>
            } />
          </Routes>
        } />
        <Route path="/tax-history" element={
          <ProtectedPermissionRoute>
            <TaxHistory />
          </ProtectedPermissionRoute>
        } />
        {/* API Operator routes with wildcard */}
        <Route path="/api-operator/*" element={
          <Routes>
            <Route path="/list" element={
              <ProtectedPermissionRoute>
                <div>Operator List</div>
              </ProtectedPermissionRoute>
            } />
            <Route path="/settings" element={
              <ProtectedPermissionRoute requiredPermission="write">
                <div>API Settings</div>
              </ProtectedPermissionRoute>
            } />
            <Route path="*" element={
              <ProtectedPermissionRoute>
                <NotFound />
              </ProtectedPermissionRoute>
            } />
          </Routes>
        } />
        {/* Fund Manage routes with wildcard */}
        <Route path="/fund-manage/*" element={
          <Routes>
            <Route path="/" element={
              <ProtectedPermissionRoute>
                <div>Fund Manage</div>
              </ProtectedPermissionRoute>
            } />
            <Route path="/add" element={
              <ProtectedPermissionRoute>
                <div>Scheme Manager</div>
              </ProtectedPermissionRoute>
            } />
            <Route path="/history" element={
              <ProtectedPermissionRoute>
                <div>Role Upgrade Request</div>
              </ProtectedPermissionRoute>
            } />
            <Route path="*" element={
              <ProtectedPermissionRoute>
                <NotFound />
              </ProtectedPermissionRoute>
            } />
          </Routes>
        } />
        {/* Reports routes with wildcard */}
        <Route path="/reports/*" element={
          <Routes>
            <Route path="/daily" element={
              <ProtectedPermissionRoute>
                <div>Daily Reports</div>
              </ProtectedPermissionRoute>
            } />
            <Route path="/monthly" element={
              <ProtectedPermissionRoute>
                <div>Monthly Reports</div>
              </ProtectedPermissionRoute>
            } />
            <Route path="*" element={
              <ProtectedPermissionRoute>
                <NotFound />
              </ProtectedPermissionRoute>
            } />
          </Routes>
        } />
        {/* Catch-all route for 404 - must be last */}
        <Route path="*" element={
          <ProtectedPermissionRoute>
            <NotFound />
          </ProtectedPermissionRoute>
        } />
      </Routes>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
