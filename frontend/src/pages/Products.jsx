import Layout from "../components/Layout";
import ProductsList from "../components/productsList.jsx";
import { useState, useEffect } from "react";
import AddProduct from "../components/AddProduct.jsx";

export default function ProductsPage() {
  const [Products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setProducts(data);
        console.log("Fetched products:", data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setShowAddForm(true);  // <--- FIXED
  };

  return (
    <Layout>
      <div className="grid">
        <div className="grid grid-cols-1 md:flex justify-between items-center bg-cyan-800 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">Products</h1>

          {/* Add Product Button */}
          <div className="md:ml-auto">
            <button
              className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddProduct}   // <--- FIXED
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Show AddProduct Form */}
        {showAddForm && <AddProduct products={Products} />}

        <div>
          {Products.length === 0 ? (
            <p className="text-gray-600">No products available.</p>
          ) : (
            <ProductsList products={Products} />
          )}
        </div>
      </div>
    </Layout>
  );
}
