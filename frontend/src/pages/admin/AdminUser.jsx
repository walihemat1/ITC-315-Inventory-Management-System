// src/pages/admin/AdminUsersPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "./adminUserSlice";

import Layout from "../../components/Layout";

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { users, loading, error, creating, updating } = useSelector(
    (state) => state.adminUsers
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "staff",
  });

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAdminUser(formData)).unwrap();
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "staff",
      });
    } catch (err) {
      console.error("Create user error:", err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await dispatch(updateAdminUserRole({ id, role: newRole })).unwrap();
    } catch (err) {
      console.error("Role update error:", err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await dispatch(
        updateAdminUserStatus({ id, isActive: !currentStatus })
      ).unwrap();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-cyan-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-cyan-200 text-sm">
              Create and manage admin and staff accounts.
            </p>
          </div>
          <div className="text-cyan-200 text-sm">
            {loading ? "Loading users..." : `Total users: ${users.length}`}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-700 text-white text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Create User Form */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Create New User
          </h2>
          <form
            onSubmit={handleCreateUser}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-cyan-100 text-sm mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                required
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-cyan-100 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-cyan-100 text-sm mb-1">
                Temporary Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                required
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Set initial password"
              />
            </div>

            <div>
              <label className="block text-cyan-100 text-sm mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-cyan-300 mt-1">
                Note: backend will enforce valid roles.
              </p>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="bg-green-600 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
              >
                {creating ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Existing Users
          </h2>

          {loading ? (
            <p className="text-cyan-200">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-cyan-200">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-cyan-700 text-cyan-200">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-cyan-800 hover:bg-cyan-800/60"
                    >
                      <td className="py-2 pr-4 text-white">{u.fullName}</td>
                      <td className="py-2 pr-4 text-cyan-100">{u.email}</td>
                      <td className="py-2 pr-4">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u._id, e.target.value)
                          }
                          className="bg-cyan-800 text-white border border-cyan-600 rounded px-2 py-1 text-xs md:text-sm"
                          disabled={updating}
                        >
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            u.isActive
                              ? "bg-green-700 text-white"
                              : "bg-red-700 text-white"
                          }`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <button
                          onClick={() => handleStatusToggle(u._id, u.isActive)}
                          disabled={updating}
                          className={`text-xs md:text-sm font-bold py-1 px-3 rounded ${
                            u.isActive
                              ? "bg-red-600 hover:bg-red-800"
                              : "bg-green-600 hover:bg-green-800"
                          } text-white disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile hint */}
              <p className="mt-2 text-xs text-cyan-300 md:hidden">
                Tip: You can scroll horizontally to see more columns.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
