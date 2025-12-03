import Layout from "../components/Layout";
import ProductsList from "../components/productsList.jsx";
import { useState, useEffect } from "react";

export default function ProductsPage() {
    const [Products, setProducts] = useState([]);

{/* Fetch products from API */}
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
    fetchProducts();
}, []);

    return (
        <Layout>
            <div className="grid">
                <div className="grid grid-cols-1 md:flex flex-colz-1 md:flex-col-3 justify-between items-center bg-cyan-800 p-4 rounded-lg mb-6">
                    <h1 className="text-2xl font-bold text-white">Products</h1>
                    {/* Search */}
                    <div className="md:mx-4 my-4 md:my-0">
                        <input
                            type="text"
                            placeholder="Search Products..."
                            className="px-4 py-2 rounded-lg w-full md:w-64 bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    {/* Add Product Button */}
                    <div className="md:ml-auto">
                        <button className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded">
                            Add Product
                        </button>
                    </div>
                </div>
                <div>
                    {Products .length === 0 ? (
                        <p className="text-gray-600">No products available.</p>
                    ) : (
                        <ProductsList products={Products } />
                    )}
                    
                </div>
            </div>
        </Layout>
    );
}