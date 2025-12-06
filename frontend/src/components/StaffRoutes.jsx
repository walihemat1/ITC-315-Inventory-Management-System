import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import StaffDashboard from "../pages/staff/StaffDashboard";

// create or plug in your staff-only pages
// import SalesPage from "../pages/Sales";

export default function StaffRoutes() {
  return (
    <ProtectedRoute allowedRoles={["staff", "manager"]}>
      <Routes>
        {/* /staff/dashboard */}
        <Route path="dashboard" element={<StaffDashboard />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}
