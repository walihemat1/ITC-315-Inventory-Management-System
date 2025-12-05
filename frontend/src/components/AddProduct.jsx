import React, { useState } from "react";

export default function AddProduct({ products = [], onProductAdded }) {
  // Extract unique categories and suppliers
  const uniqueCategories = [
    ...new Map(
      products
        .filter((p) => p.categoryId)
        .map((p) => [p.categoryId._id, p.categoryId])
    ).values(),
  ];

  const uniqueSuppliers = [
    ...new Map(
      products
        .filter((p) => p.supplierId)
        .map((p) => [p.supplierId._id, p.supplierId])
    ).values(),
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categoryId: "",
    supplierId: "",
    purchasePrice: "",
    sellingPrice: "",
    currentQuantity: "",
    minimumQuantity: "",
    image: null, // fixed
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("sku", formData.sku);
      data.append("categoryId", formData.categoryId);
      data.append("supplierId", formData.supplierId);
      data.append("purchasePrice", formData.purchasePrice);
      data.append("sellingPrice", formData.sellingPrice);
      data.append("currentQuantity", formData.currentQuantity);
      data.append("minimumQuantity", formData.minimumQuantity);

      if (formData.image) {
        data.append("image", formData.image); // fixed
      }

      const response = await fetch(
        "http://localhost:5000/api/products/create",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        onProductAdded(result);

        setFormData({
          name: "",
          sku: "",
          categoryId: "",
          supplierId: "",
          purchasePrice: "",
          sellingPrice: "",
          currentQuantity: "",
          minimumQuantity: "",
          image: null,
        });
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Error submitting product");
    }
  };

  return (
    <div className="my-6 p-6 bg-cyan-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white mb-4">Add New Product</h2>
      <div className="border-b"></div>
      <form
        className="bg-cyan-800 p-4 font-semibold rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        {/* Product Name */}
        <div className="mb-4 grid md:flex">
          <label className="block text-white mb-2 min-w-[120px]">
            Product Name
          </label>
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
            placeholder="Enter SKU"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4 grid md:flex">
          <label className="block text-white mb-2 min-w-[120px]">
            Category
          </label>
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
          <label className="block text-white mb-2 min-w-[120px]">
            Supplier
          </label>
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

        {/* Purchase Price */}
        <div className="mb-4 grid md:flex">
          <label className="block min-w-[120px] text-white mb-2">
            Purchase Price
          </label>
          <input
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            className="w-full p-2 rounded bg-cyan-700 text-white border border-cyan-600"
            required
          />
        </div>

        {/* Selling Price */}
        <div className="mb-4 grid md:flex">
          <label className="block min-w-[120px] text-white mb-2">
            Selling Price
          </label>
          <input
            type="number"
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleChange}
            className="w-full p-2 rounded bg-cyan-700 text-white border border-cyan-600"
            required
          />
        </div>

        {/* Quantity */}
        <div className="mb-4 grid md:flex">
          <label className="block min-w-[120px] text-white mb-2">
            Quantity
          </label>
          <input
            type="number"
            name="currentQuantity"
            value={formData.currentQuantity}
            onChange={handleChange}
            className="w-full p-2 rounded bg-cyan-700 text-white border border-cyan-600"
            required
          />
        </div>

        {/* Minimum Quantity */}
        <div className="mb-4 grid md:flex">
          <label className="block min-w-[120px] text-white mb-2">
            Minimum Quantity
          </label>
          <input
            type="number"
            name="minimumQuantity"
            value={formData.minimumQuantity}
            onChange={handleChange}
            className="w-full p-2 rounded bg-cyan-700 text-white border border-cyan-600"
            required
          />
        </div>

        {/* Product Image */}
        <div className="mb-4 grid md:flex items-center mx-auto justify-center">
          <label className="block min-w-[120px] text-white mb-2">
            Product Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="p-2 rounded bg-cyan-700 text-white border border-cyan-600"
          />
        </div>

        {/* Submit */}
        <div className="flex py-3 justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
