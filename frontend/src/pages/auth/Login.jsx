// src/pages/Login.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./authSlice";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || "/Dashboard"; // redirect after login

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();

      navigate(from, { replace: true });
    } catch (err) {
      // error is handled in Redux, nothing else needed here
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-teal-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-cyan-900 rounded-xl shadow-lg p-8 border border-cyan-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">IMS Login</h1>
          <p className="text-cyan-200 text-sm">
            Sign in to access Inventory Management System
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-700 text-white text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-cyan-100 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-cyan-100 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded mt-2 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-xs text-cyan-300 text-center">
          Access is restricted. New accounts are created by Admin only.
        </p>
      </div>
    </div>
  );
}
