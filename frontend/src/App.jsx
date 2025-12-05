import "./App.css";

import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";
import ProductsPage from "./pages/Products";

import AdminRoutes from "./components/AdminRoutes";
import StaffRoutes from "./components/StaffRoutes";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path="/staff/*" element={<StaffRoutes />} />

        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "manager"]}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
export default App;
