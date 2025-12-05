import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

export default function AddSupplierPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    balance: 0,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const Add = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:5000/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      navigate("/admin/suppliers");
    } catch (error) {
      console.error("Error creating supplier:", error);
    }
  };

  return (
    <Layout>
        <div className="max-w-md mx-auto mt-10 bg-cyan-800 text-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-200 text-center">Add Supplier</h2>
    
            <form onSubmit={Add} className="space-y-4">
                {/* Name */}
                <div>
                <label className="block text-gray-200 font-medium mb-1" htmlFor="name">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Supplier Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                </div>
    
                {/* Phone */}
                <div>
                <label className="block text-gray-200 font-medium mb-1" htmlFor="phone">
                    Phone
                </label>
                <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                </div>
    
                {/* Email */}
                <div>
                <label className="block text-gray-200 font-medium mb-1" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                </div>
    
                {/* Address */}
                <div>
                <label className="block text-gray-200 font-medium mb-1" htmlFor="address">
                    Address
                </label>
                <input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                </div>
    
                {/* Balance */}
                <div>
                <label className="block text-gray-200 font-medium mb-1" htmlFor="balance">
                    Balance
                </label>
                <input
                    id="balance"
                    name="balance"
                    type="number"
                    value={form.balance}
                    onChange={handleChange}
                    placeholder="Balance Amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                </div>
    
                {/* Submit Button */}
                <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                Create
                </button>
            </form>
            </div>
    
        </Layout>
  );
}
