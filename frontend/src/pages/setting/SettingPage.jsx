// src/pages/admin/SettingsPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings, saveSettings } from "./settingSlice";
import Layout from "../../components/Layout";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { data, loading, error, saving, saveError } = useSelector(
    (state) => state.settings
  );

  const [formData, setFormData] = useState({
    shopName: "",
    address: "",
    currency: "USD",
    taxRate: 0,
    logoUrl: "",
  });

  // Load settings on mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // When settings data comes in, fill the form
  useEffect(() => {
    if (data) {
      setFormData({
        shopName: data.shopName || "",
        address: data.address || "",
        currency: data.currency || "USD",
        taxRate: data.taxRate ?? 0,
        logoUrl: data.logoUrl || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "taxRate" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(saveSettings(formData)).unwrap();
      alert("Settings saved successfully");
    } catch (err) {
      console.error("Save settings error:", err);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-cyan-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-cyan-200 text-sm">
              Configure your shop details, currency, tax, and logo.
            </p>
          </div>
          {loading && (
            <div className="text-cyan-200 text-sm">
              Loading current settings...
            </div>
          )}
        </div>

        {/* Errors */}
        {error && (
          <div className="bg-red-700 text-white text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}
        {saveError && (
          <div className="bg-red-700 text-white text-sm px-3 py-2 rounded">
            {saveError}
          </div>
        )}

        {/* Form */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Shop Name */}
            <div className="md:col-span-1">
              <label className="block text-cyan-100 text-sm mb-1">
                Shop Name
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="e.g. IMS Store"
              />
            </div>

            {/* Currency */}
            <div className="md:col-span-1">
              <label className="block text-cyan-100 text-sm mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="AFN">AFN - Afghani</option>
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-cyan-100 text-sm mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Street, City, Country"
              />
            </div>

            {/* Tax Rate */}
            <div className="md:col-span-1">
              <label className="block text-cyan-100 text-sm mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                name="taxRate"
                min="0"
                step="0.01"
                value={formData.taxRate}
                onChange={handleChange}
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="e.g. 5"
              />
              <p className="text-xs text-cyan-300 mt-1">
                Set the default tax percentage to be applied on sales.
              </p>
            </div>

            {/* Logo URL */}
            <div className="md:col-span-1">
              <label className="block text-cyan-100 text-sm mb-1">
                Logo URL
              </label>
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-cyan-300 mt-1">
                Provide a direct image URL for the shop logo.
              </p>
            </div>

            {/* Logo Preview */}
            {formData.logoUrl && (
              <div className="md:col-span-2">
                <p className="text-cyan-100 text-sm mb-1">Logo Preview</p>
                <div className="bg-cyan-950 rounded-lg p-3 inline-flex items-center">
                  <img
                    src={formData.logoUrl}
                    alt="Logo preview"
                    className="w-20 h-20 object-contain rounded bg-teal-950 border border-cyan-700"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
