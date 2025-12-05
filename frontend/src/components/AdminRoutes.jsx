import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import ProductsPage from "../pages/Products";
import PurchasesPage from "../pages/Purchases";
// add more admin-only pages as needed

export default function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Routes>
        {/* /admin/dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="purchases" element={<PurchasesPage />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}
