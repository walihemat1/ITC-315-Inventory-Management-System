import Layout from "../components/Layout";
import SaleList from "../components/SaleList.jsx";
import { useState, useEffect } from "react";
import AddSale from "../components/AddSale.jsx";
import EditSale from "../components/EditSale.jsx";

export default function SalesPage() {
  const [Sales, setSales] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSaleList, setShowSaleList] = useState(true);
  const [Sale, setSale] = useState(null);

  const [Customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/customers", {
          method: "GET",
          credentials: "include", // <-- THIS SENDS COOKIES!
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching Customers:", error);
      }
    };

    fetchCustomers();
  }, []);
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sales", {
          method: "GET",
          credentials: "include", // <-- THIS SENDS COOKIES!
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setSales(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching Sales:", error);
      }
    };

    fetchSales();
  }, []);

  // Build unique category and supplier lists
  const [uniqueCategories, setUniqueCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();

        setUniqueCategories(data); // ← Insert JSON array into list
        console.log("Categories:", data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddSale = () => {
    setShowAddForm(true);
    setShowSaleList(false);
    setShowEditForm(false);
  };

  const handleEditSale = (p) => {
    setSale(p); // store selected Sale
    setShowEditForm(true); // show form
    setShowSaleList(false);
    setShowAddForm(false);
  };

  return (
    <Layout>
      <div className="grid">
        <div className="grid grid-cols-1 md:flex justify-between items-center bg-cyan-800 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">Sales</h1>

          <div className="md:ml-auto">
            <button
              className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddSale}
            >
              Add Sale
            </button>
          </div>
        </div>

        {showAddForm && <AddSale Sales={Sales} Customers={Customers} />}

        {showEditForm && (
          <EditSale
            Sale={Sale}
            Customers={Customers}
            onEditSale={(updated) => {
              setSales((prev) =>
                prev.map((p) => (p._id === updated._id ? updated : p))
              );
            }}
          />
        )}

        {showSaleList && (
          <div>
            {Sales.length === 0 ? (
              <p className="text-gray-600">No Sales available.</p>
            ) : (
              <SaleList
                Sales={Sales}
                onEditSale={handleEditSale} // <-- now passes Sale
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
