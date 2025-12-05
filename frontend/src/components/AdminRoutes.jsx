// src/components/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsersPage from "../pages/admin/AdminUser";
// import ProductsPage from "../pages/Products";
import PurchasesPage from "../pages/Purchases";

export default function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        {/* <Route path="products" element={<ProductsPage />} /> */}
        <Route path="purchases" element={<PurchasesPage />} />

        {/* Default: /admin -> /admin/dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}
