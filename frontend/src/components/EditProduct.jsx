import React, { useState, useEffect } from "react";

export default function EditProduct({
  product,
  onEditProduct,
  uniqueCategories = [],
  uniqueSuppliers = []
}) {

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categoryId: "",
    supplierId: "",
    purchasePrice: "",
    sellingPrice: "",
    currentQuantity: "",
    minimumQuantity: "",
    image: null,
    imageUrl: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        categoryId: product.categoryId?._id || "",
        supplierId: product.supplierId?._id || "",
        purchasePrice: product.purchasePrice || "",
        sellingPrice: product.sellingPrice || "",
        currentQuantity: product.currentQuantity || "",
        minimumQuantity: product.minimumQuantity || "",
        image: null,
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await fetch(
        `http://localhost:5000/api/products/${product._id}`,
        {
          method: "PUT",
          body: data,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Product Updated successfully!");
        onEditProduct(result);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error Updating product");
    }
  };

  return (
    <div className="my-6 p-2 md:p-6 bg-cyan-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white mb-4">Edit Product</h2>

      <form className="bg-cyan-800 p-4 rounded-lg shadow-md" onSubmit={handleSubmit}>
        {/* Image */}
        <img
          className="h-48 w-48 mx-auto mb-3"
          src={`http://localhost:5000${formData.imageUrl}`}
        />
        <div className="mb-4 grid md:flex items-center mx-auto justify-center">
          <label className="block min-w-[120px] text-white mb-2">Product Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="p-2 rounded bg-cyan-700 text-white border border-cyan-600"
          />
        </div>

        {/* Name */}
        <div className="mb-4 grid md:flex">
          <label className="block text-white mb-2 min-w-[120px]">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-cyan-700 text-white border border-cyan-600"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* SKU */}
        <div className="mb-4 grid md:flex">
          <label className="block text-white mb-2 min-w-[120px]">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full p-2 rounded bg-cyan-700 text-white border border-cyan-600"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4 grid md:flex">
          <label className="block text-white mb-2 min-w-[120px]">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-cyan-700 text-white border border-cyan-600"
            required
          >
            <option value="">Select Category</option>
            {uniqueCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier */}
        <div className="mb-4 grid md:flex">
          <label className="block text-white mb-2 min-w-[120px]">Supplier</label>
          <select
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-cyan-700 text-white border border-cyan-600"
          >
            <option value="">Select Supplier</option>
            {uniqueSuppliers.map((sup) => (
              <option key={sup._id} value={sup._id}>
                {sup.name}
              </option>
            ))}
          </select>
        </div>

        {/* Other Inputs (Prices, Quantity, etc.) */}
        {[
          ["purchasePrice", "Purchase Price"],
          ["sellingPrice", "Selling Price"],
          ["currentQuantity", "Quantity"],
          ["minimumQuantity", "Minimum Quantity"],
        ].map(([field, label]) => (
          <div className="mb-4 grid md:flex" key={field}>
            <label className="block min-w-[120px] text-white mb-2">{label}</label>
            <input
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 rounded bg-cyan-700 text-white border border-cyan-600"
              required
            />
          </div>
        ))}

        {/* Submit */}
        <div className="flex justify-center">
          <button className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
