import Layout from "../components/Layout";
import PurchaseList from "../components/PurchaseList.jsx";
import { useState, useEffect } from "react";
import AddPurchase from "../components/AddPurchase.jsx";
import EditPurchase from "../components/EditPurchase.jsx";

export default function PurchasesPage() {
  const [Purchases, setPurchases] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPurchaseList, setShowPurchaseList] = useState(true);
  const [Purchase, setPurchase] = useState(null);

  const [Suppliers, setSuppliers] =useState([]);

    useEffect(() => {
      const fetchSuppliers = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/suppliers",{
            credentials: "include"
          });
          const data = await response.json();
          setSuppliers(data);
        } catch (error) {
          console.error("Error fetching Suppliers:", error);
        }
      };
  
      fetchSuppliers();
    }, []);
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/purchase",{
            credentials: "include"
          });
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error("Error fetching Purchases:", error);
      }
    };

    fetchPurchases();
  }, []);

  // Build unique category and supplier lists
  const [uniqueCategories, setUniqueCategories] = useState([]);

  useEffect(() => {  
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories",{
            credentials: "include"
          });
        const data = await response.json();

        setUniqueCategories(data);  // ← Insert JSON array into list
        console.log("Categories:", data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddPurchase = () => {
    setShowAddForm(true);
    setShowPurchaseList(false);
    setShowEditForm(false);
  };

  const handleEditPurchase = (p) => {
    setPurchase(p);          // store selected Purchase
    setShowEditForm(true);  // show form
    setShowPurchaseList(false);
    setShowAddForm(false);
  };

  return (
    <Layout>
      <div className="grid">
        <div className="grid grid-cols-1 md:flex justify-between items-center bg-cyan-800 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">Purchases</h1>

          <div className="md:ml-auto">
            <button
              className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddPurchase}
            >
              Add Purchase
            </button>
          </div>
        </div>

        {showAddForm && <AddPurchase Purchases={Purchases} suppliers={Suppliers} />}

        {showEditForm && (
          <EditPurchase
            Purchase={Purchase}
            Suppliers ={Suppliers}
            onEditPurchase={(updated) => {
              setPurchases(prev =>
                prev.map(p => p._id === updated._id ? updated : p)
              );
            }}
          />
        )}

        {showPurchaseList && <div>
          {Purchases.length === 0 ? (
            <p className="text-gray-600">No Purchases available.</p>
          ) : (
            <PurchaseList
              Purchases={Purchases}
              onEditPurchase={handleEditPurchase}  // <-- now passes Purchase
            />
          )}
        </div> }
      </div>
    </Layout>
  );
}
