// src/components/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import ProductsPage from "../pages/Products";
import EditSupplierPage from "./EditSupplierPage";
import AddSupplierPage from "./AddSupplierPage";
import SupplierManager from "../pages/SupplierManager"
import CustomerManager from "../pages/CustomerManager";
import EditCustomerPage from "./EditCustomerPage";
import AddCustomerPage from "./AddCustomerPage";
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

        <Route path="suppliers" element={<SupplierManager/>} />

        <Route path="editsupplier/:id" element={<EditSupplierPage/>} />

        <Route path="addsupplier" element={<AddSupplierPage/>} />
        
        <Route path="editcustomer/:id" element={<EditCustomerPage/>} />

        <Route path="addcustomer" element={<AddCustomerPage/>} />
        
        <Route path="customers" element={<CustomerManager/>} />

        {/* Default: /admin -> /admin/dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}
