// src/App.js
import "./App.css";

import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/Products";
import PurchasesPage from "./pages/Purchases";
import Login from "./pages/auth/Login";
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

        {/* Protected routes */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <PurchasesPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect to Dashboard */}
        <Route path="/" element={<Navigate to="/Dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
