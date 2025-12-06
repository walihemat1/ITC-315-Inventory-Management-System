// src/components/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductsPage from "../pages/Products";
import Sales from "../pages/Sales";
import EditSupplierPage from "./EditSupplierPage";
import AddSupplierPage from "./AddSupplierPage";
import SupplierManager from "../pages/SupplierManager";
import CustomerManager from "../pages/CustomerManager";
import EditCustomerPage from "./EditCustomerPage";
import AddCustomerPage from "./AddCustomerPage";
import AdminUsersPage from "../pages/admin/AdminUser";
import PurchasesPage from "../pages/Purchases";
import SettingsPage from "../pages/setting/SettingPage";
import ReportsPage from "../pages/report/ReportsPage";
import CategoryPage from "../pages/category/Category";

export default function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        {/* <Route path="products" element={<ProductsPage />} /> */}
        <Route path="purchases" element={<PurchasesPage />} />

        <Route path="sales" element={<Sales />} />

        <Route path="suppliers" element={<SupplierManager />} />

        <Route path="editsupplier/:id" element={<EditSupplierPage />} />

        <Route path="addsupplier" element={<AddSupplierPage />} />

        <Route path="editcustomer/:id" element={<EditCustomerPage />} />

        <Route path="addcustomer" element={<AddCustomerPage />} />
        <Route path="categories" element={<CategoryPage />} />

        <Route path="customers" element={<CustomerManager />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="reports" element={<ReportsPage />} />

        {/* Default: /admin -> /admin/dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}
