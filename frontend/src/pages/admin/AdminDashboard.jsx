// src/pages/AdminDashboard.jsx
import Layout from "../../components/Layout";

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="bg-cyan-800 p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-cyan-200">
          Welcome, Admin. Here you can manage users, inventory configuration,
          and high-level reports.
        </p>
      </div>

      {/* You can add cards / stats / links here */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-cyan-900 rounded-lg p-4 border border-cyan-700">
          <h2 className="text-white font-semibold mb-1">User Management</h2>
          <p className="text-cyan-200 text-sm">
            Create and manage staff and manager accounts.
          </p>
        </div>
        <div className="bg-cyan-900 rounded-lg p-4 border border-cyan-700">
          <h2 className="text-white font-semibold mb-1">Inventory Overview</h2>
          <p className="text-cyan-200 text-sm">
            High-level view of stock levels and alerts.
          </p>
        </div>
        <div className="bg-cyan-900 rounded-lg p-4 border border-cyan-700">
          <h2 className="text-white font-semibold mb-1">Reports</h2>
          <p className="text-cyan-200 text-sm">
            Sales, purchases, and performance metrics.
          </p>
        </div>
      </div>
    </Layout>
  );
}
