import Layout from "../components/Layout";
import ProductsList from "../components/productsList.jsx";
import { useState, useEffect } from "react";
import AddProduct from "../components/AddProduct.jsx";
import EditProduct from "../components/EditProduct.jsx";

export default function ProductsPage() {
  const [Products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showProductList, setShowProductList] = useState(true);
  const [product, setProduct] = useState(null);

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

  // Build unique category and supplier lists
  const [uniqueCategories, setUniqueCategories] = useState([]);

  useEffect(() => {  
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();

        setUniqueCategories(data);  // ← Insert JSON array into list
        console.log("Categories:", data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const uniqueSuppliers = [
    ...new Map(
      Products.filter((p) => p.supplierId)
        .map((p) => [p.supplierId._id, p.supplierId])
    ).values()
  ];

  const handleAddProduct = () => {
    setShowAddForm(true);
    setShowProductList(false);
    setShowEditForm(false);
  };

  const handleEditProduct = (p) => {
    setProduct(p);          // store selected product
    setShowEditForm(true);  // show form
    setShowProductList(false);
    setShowAddForm(false);
  };

  return (
    <Layout>
      <div className="grid">
        <div className="grid grid-cols-1 md:flex justify-between items-center bg-cyan-800 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">Products</h1>

          <div className="md:ml-auto">
            <button
              className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          </div>
        </div>

        {showAddForm && <AddProduct products={Products} />}

        {showEditForm && (
          <EditProduct
            product={product}
            uniqueCategories={uniqueCategories}
            uniqueSuppliers={uniqueSuppliers}
            onEditProduct={(updated) => {
              setProducts(prev =>
                prev.map(p => p._id === updated._id ? updated : p)
              );
            }}
          />
        )}

        {showProductList && <div>
          {Products.length === 0 ? (
            <p className="text-gray-600">No products available.</p>
          ) : (
            <ProductsList
              products={Products}
              onEditProduct={handleEditProduct}  // <-- now passes product
            />
          )}
        </div> }
      </div>
    </Layout>
  );
}
