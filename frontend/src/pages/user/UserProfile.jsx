// src/pages/UserProfilePage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import { updateProfile, updatePassword, clearUserMessages } from "./userSlice";
import { updateAuthUser } from "../auth/authSlice";

export default function UserProfilePage() {
  const dispatch = useDispatch();

  // ---- AUTH STATE (for prefilling + navbar sync) ----
  const auth = useSelector((state) => state.auth) || {};
  const authUser = auth.user || {};
  const role = authUser.role || auth.role || "staff";

  const initialFullName =
    authUser.fullName || auth.fullName || authUser.username || "";
  const initialEmail = authUser.email || auth.email || "";

  // ---- USER SLICE STATE (loading + messages) ----
  const {
    updatingProfile,
    updateProfileError,
    updateProfileSuccess,
    updatingPassword,
    updatePasswordError,
    updatePasswordSuccess,
  } = useSelector((state) => state.user || {});

  // ---- LOCAL FORM STATE ----
  const [profileForm, setProfileForm] = useState({
    fullName: initialFullName,
    email: initialEmail,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // sync when auth changes
  useEffect(() => {
    setProfileForm({
      fullName: initialFullName,
      email: initialEmail,
    });
  }, [initialFullName, initialEmail]);

  // clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearUserMessages());
    };
  }, [dispatch]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // backend expects: username, email, profilePic
    const payload = {
      username: profileForm.fullName,
      fullName: profileForm.fullName,
      email: profileForm.email,
      profilePic: "profile-placeholder", // just to satisfy backend requirement
    };

    try {
      const res = await dispatch(updateProfile(payload)).unwrap();
      // res should be: { success, message, data: updatedUser }
      if (res?.data) {
        dispatch(updateAuthUser(res.data)); // 🔔 sync navbar/auth user
      }
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }

    try {
      await dispatch(
        updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      ).unwrap();

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password update error:", err);
    }
  };

  const initials = (profileForm.fullName || initialEmail || "U")
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <Layout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-900 via-cyan-800 to-teal-900 p-5 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-700 flex items-center justify-center text-white text-xl font-bold border border-teal-300">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                My Profile
              </h1>
              <p className="text-cyan-200 text-sm">
                Manage your account details and secure your password.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-cyan-300">
              Signed in as
            </p>
            <p className="text-sm text-white font-semibold truncate max-w-xs">
              {initialEmail || "Unknown"}
            </p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-700 text-teal-100 border border-teal-400">
              {role === "admin" ? "Admin" : "Staff"} account
            </span>
          </div>
        </div>

        {/* GLOBAL MESSAGES */}
        <div className="space-y-2">
          {updateProfileError && (
            <div className="bg-red-700 text-white text-sm px-3 py-2 rounded border border-red-500">
              {updateProfileError}
            </div>
          )}
          {updateProfileSuccess && (
            <div className="bg-green-700 text-white text-sm px-3 py-2 rounded border border-green-500">
              {updateProfileSuccess}
            </div>
          )}
          {updatePasswordError && (
            <div className="bg-red-700 text-white text-sm px-3 py-2 rounded border border-red-500">
              {updatePasswordError}
            </div>
          )}
          {updatePasswordSuccess && (
            <div className="bg-green-700 text-white text-sm px-3 py-2 rounded border border-green-500">
              {updatePasswordSuccess}
            </div>
          )}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PROFILE CARD */}
          <div className="lg:col-span-2 bg-cyan-900 border border-cyan-700 rounded-xl p-5 md:p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Profile Information
              </h2>
              <span className="text-xs text-cyan-300">
                Keep your contact info up to date.
              </span>
            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="space-y-4 md:space-y-5"
            >
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-100 text-sm mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    required
                    className="w-full p-2.5 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-cyan-100 text-sm mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                    className="w-full p-2.5 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              {/* Role info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-100 text-sm mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={role === "admin" ? "Admin" : "Staff"}
                    readOnly
                    className="w-full p-2.5 rounded bg-gray-800 text-gray-200 border border-cyan-700 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <p className="text-xs text-cyan-300">
                    Only administrators can change roles. Contact an admin if
                    your permissions need to be updated.
                  </p>
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2 px-5 rounded-lg shadow transition-colors"
                >
                  {updatingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* PASSWORD CARD */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-xl p-5 md:p-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-3">
              Change Password
            </h2>
            <p className="text-xs text-cyan-300 mb-4">
              Use a strong and unique password to keep your account secure.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-cyan-100 text-sm mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full p-2.5 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-cyan-100 text-sm mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full p-2.5 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-cyan-100 text-sm mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full p-2.5 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <p className="text-xs text-cyan-300">
                Minimum 6 characters. Use a mix of letters, numbers, and symbols
                if possible.
              </p>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg shadow"
                >
                  {updatingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
