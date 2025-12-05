import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function CustomerListPage() {
  const [Customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching Customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this Customer?")) return;

    try {
      await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "DELETE",
      });

      setCustomers(Customers.filter((Customer) => Customer._id !== id));
    } catch (error) {
      console.error("Error deleting Customer:", error);
    }
  };

  return (
    <Layout>
    <div className="page">
      <h2 className="m-4 font-bold text-xl">Customers List</h2>
      <button onClick={() => navigate("/admin/addCustomer")}>
        ➕ Add Customer
      </button>

      <div className="flex flex-wrap gap-6 mt-6">
      {Customers.map((Customer) => (
        <div
          key={Customer._id}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white rounded-xl shadow-md p-5 border border-gray-200"
        >
          <h3 className="text-xl text-gray-600 font-semibold mb-3">{Customer.name}</h3>

          <p className="text-gray-600 mb-1"><span className="font-medium">📞 Phone:</span> {Customer.phone || "—"}</p>
          <p className="text-gray-600 mb-1"><span className="font-medium">📧 Email:</span> {Customer.email || "—"}</p>
          <p className="text-gray-600 mb-1"><span className="font-medium">📍 Address:</span> {Customer.address || "—"}</p>
          <p className="text-gray-600 mb-3"><span className="font-medium">💰 Balance:</span> {Customer.balance}</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => navigate(`../editCustomer/${Customer._id}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              ✏ Edit
            </button>

            <button
              onClick={() => deleteCustomer(Customer._id)}
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
