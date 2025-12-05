import Layout from "../components/Layout";
import { useSelector } from "react-redux";

export default function StaffDashboard() {
  const { user, role } = useSelector((state) => state.auth);

  return (
    <Layout>
      <div className="bg-cyan-800 p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {role === "admin" ? "Admin View" : "User Dashboard"}
        </h1>
        <p className="text-cyan-200">
          Welcome{user?.username ? `, ${user.username}` : ""}! You are logged in
          as{" "}
          <span className="font-semibold text-teal-200">{role || "user"}</span>.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-cyan-900 rounded-lg p-4 border border-cyan-700">
          <h2 className="text-white font-semibold mb-1">Quick Actions</h2>
          <p className="text-cyan-200 text-sm">
            Go to Products, Purchases, and Sales to manage inventory.
          </p>
        </div>
        <div className="bg-cyan-900 rounded-lg p-4 border border-cyan-700">
          <h2 className="text-white font-semibold mb-1">Low Stock</h2>
          <p className="text-cyan-200 text-sm">
            View products that are running low and need restocking.
          </p>
        </div>
        <div className="bg-cyan-900 rounded-lg p-4 border border-cyan-700">
          <h2 className="text-white font-semibold mb-1">Recent Activity</h2>
          <p className="text-cyan-200 text-sm">
            Track your latest purchases and sales.
          </p>
        </div>
      </div>
    </Layout>
  );
}
