import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function SupplierListPage() {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/suppliers");
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const deleteSupplier = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;

    try {
      await fetch(`http://localhost:5000/api/suppliers/${id}`, {
        method: "DELETE",
      });

      setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  return (
    <Layout>
    <div className="page">
      <h2 className="m-4 font-bold text-xl">Suppliers List</h2>
      <button onClick={() => navigate("/admin/addsupplier")}>
        ➕ Add Supplier
      </button>

      <div className="flex flex-wrap gap-6 mt-6">
      {suppliers.map((supplier) => (
        <div
          key={supplier._id}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white rounded-xl shadow-md p-5 border border-gray-200"
        >
          <h3 className="text-xl text-gray-600 font-semibold mb-3">{supplier.name}</h3>

          <p className="text-gray-600 mb-1"><span className="font-medium">📞 Phone:</span> {supplier.phone || "—"}</p>
          <p className="text-gray-600 mb-1"><span className="font-medium">📧 Email:</span> {supplier.email || "—"}</p>
          <p className="text-gray-600 mb-1"><span className="font-medium">📍 Address:</span> {supplier.address || "—"}</p>
          <p className="text-gray-600 mb-3"><span className="font-medium">💰 Balance:</span> {supplier.balance}</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => navigate(`../editsupplier/${supplier._id}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              ✏ Edit
            </button>

            <button
              onClick={() => deleteSupplier(supplier._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>


    </div>
    </Layout>
  );
}
