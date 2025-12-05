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
import PurchasesPage from "../pages/Purchases";
// add more admin-only pages as needed

export default function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Routes>
        {/* /admin/dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="purchases" element={<PurchasesPage />} />

        <Route path="suppliers" element={<SupplierManager/>} />

        <Route path="editsupplier/:id" element={<EditSupplierPage/>} />

        <Route path="addsupplier" element={<AddSupplierPage/>} />
        
        <Route path="editcustomer/:id" element={<EditCustomerPage/>} />

        <Route path="addcustomer" element={<AddCustomerPage/>} />
        
        <Route path="customers" element={<CustomerManager/>} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}
