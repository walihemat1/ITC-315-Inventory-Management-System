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

        {/* Admin-only route group: /admin/* */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Staff-only route group: /staff/* */}
        <Route path="/staff/*" element={<StaffRoutes />} />

        {/* Protected single route (example: both admin & staff can see products) */}
        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "manager"]}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        {/* Default root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
