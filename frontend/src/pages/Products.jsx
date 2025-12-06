import Layout from "../components/Layout";
import ProductsList from "../components/productsList.jsx";
import { useState, useEffect } from "react";
import AddProduct from "../components/AddProduct.jsx";
import EditProduct from "../components/EditProduct.jsx";
import { useSelector } from "react-redux";

export default function ProductsPage() {
  const { user } = useSelector((state) => state.auth); // <-- get logged user & role
  const isAdmin = user?.role === "admin";

  const [Products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showProductList, setShowProductList] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        const productsArray = Array.isArray(result) ? result : result.data;

        setProducts(productsArray || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Categories
  const [uniqueCategories, setUniqueCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories", {
          credentials: "include",
        });
        const data = await response.json();
        setUniqueCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Unique suppliers
  const uniqueSuppliers = [
    ...new Map(
      Products.filter((p) => p.supplierId).map((p) => [
        p.supplierId._id,
        p.supplierId,
      ])
    ).values(),
  ];

  const handleAddProduct = () => {
    if (!isAdmin) return; // no access
    setShowAddForm(true);
    setShowProductList(false);
    setShowEditForm(false);
  };

  const handleEditProduct = (p) => {
    if (!isAdmin) return; // staff cannot edit
    setProduct(p);
    setShowEditForm(true);
    setShowProductList(false);
    setShowAddForm(false);
  };

  return (
    <Layout>
      <div className="grid">
        <div className="grid grid-cols-1 md:flex justify-between items-center bg-cyan-800 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">Products</h1>

          {/* Only admin can see Add Product button */}
          {isAdmin && (
            <div className="md:ml-auto">
              <button
                className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>
          )}
        </div>

        {/* Only admin can add products */}
        {isAdmin && showAddForm && <AddProduct products={Products} />}

        {/* Only admin can edit products */}
        {isAdmin && showEditForm && (
          <EditProduct
            product={product}
            uniqueCategories={uniqueCategories}
            uniqueSuppliers={uniqueSuppliers}
            onEditProduct={(updated) => {
              setProducts((prev) =>
                prev.map((p) => (p._id === updated._id ? updated : p))
              );
            }}
          />
        )}

        {showProductList && (
          <div>
            {Products.length === 0 ? (
              <p className="text-gray-600">No products available.</p>
            ) : (
              <ProductsList
                products={Products}
                onEditProduct={isAdmin ? handleEditProduct : null} // staff gets no edit action
                isAdmin={isAdmin} // pass role for delete icon
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
