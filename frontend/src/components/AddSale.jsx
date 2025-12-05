import React, { useState, useEffect } from "react";

export default function AddSales({ Customers = [], onSaleAdded }) {
  const [formData, setFormData] = useState({
    supplierId: "",
    date: "",
    amountPaid: 0,
  });

  const [items, setItems] = useState([
    { productId: "", quantity: 1, unitCost: 0, totalCost: 0 },
  ]);

  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  // Auto-recalculate total
  useEffect(() => {
    const sum = items.reduce((acc, item) => acc + Number(item.totalCost || 0), 0);
    setTotalAmount(sum);
  }, [items]);

  // Handle form fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle item field change
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "quantity" || field === "unitCost") {
      const qty = Number(updated[index].quantity);
      const cost = Number(updated[index].unitCost);
      updated[index].totalCost = qty * cost;
    }

    setItems(updated);
  };

  // When product is selected
  const handleProductSelect = (index, e) => {
    const productId = e.target.value;
    const selectedProduct = products.find((p) => p._id === productId);

    handleItemChange(index, "productId", productId);

    if (selectedProduct) {
      handleItemChange(index, "unitCost", selectedProduct.sellingPrice);
      handleItemChange(
        index,
        "totalCost",
        selectedProduct.sellingPrice * items[index].quantity
      );
    }
  };

  // Add new row
  const addItem = () => {
    setItems([
      ...items,
      { productId: "", quantity: 1, unitCost: 0, totalCost: 0 },
    ]);
  };

  // Remove row
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Submit sale
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customerId: formData.customerId,
      date: formData.date || new Date(),
      items,
      totalAmount,
      amountPaid: Number(formData.amountPaid),
      balanceRemaining: totalAmount - Number(formData.amountPaid),
    };

    try {
      const res = await fetch("http://localhost:5000/api/sales/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Sale added successfully!");
        onSaleAdded(data);

        setFormData({ customerId: "", date: "", amountPaid: 0 });
        setItems([{ productId: "", quantity: 1, unitCost: 0, totalCost: 0 }]);
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error submitting sale:", err);
      alert("Failed to submit sale");
    }
  };

  return (
    <div className="my-6 p-6 bg-cyan-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white mb-4">Add Sale</h2>
      <div className="border-b mb-4"></div>

      <form onSubmit={handleSubmit}>
        
        {/* Customer */}
        <div className="mb-4 grid md:flex">
          <label className="text-white min-w-[120px]">Customer</label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleFormChange}
            required
            className="p-2 bg-cyan-700 text-white rounded border border-cyan-600 w-full"
          >
            <option value="">Select Customer</option>
            {Customers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="mb-4 grid md:flex">
          <label className="text-white min-w-[120px]">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
            className="p-2 bg-cyan-700 text-white rounded border border-cyan-600 w-full"
          />
        </div>

        {/* Items */}
        <h3 className="text-white mt-6 mb-2 font-semibold">Items</h3>

        {items.map((item, index) => (
          <div key={index} className="mb-4 p-3 bg-cyan-700 rounded border border-cyan-600">
            <div className="grid md:grid-cols-5 gap-3">

              {/* Product */}
              <select
                value={item.productId}
                onChange={(e) => handleProductSelect(index, e)}
                required
                className="p-2 rounded bg-cyan-600 text-white"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* Quantity */}
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                className="p-2 rounded bg-cyan-600 text-white"
              />

              {/* Unit Cost */}
              <input
                type="number"
                value={item.unitCost}
                onChange={(e) => handleItemChange(index, "unitCost", e.target.value)}
                className="p-2 rounded bg-cyan-600 text-white"
              />

              {/* Total Cost */}
              <input
                type="number"
                readOnly
                value={item.totalCost}
                className="p-2 rounded bg-gray-500 text-white"
              />

              {/* Remove */}
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="bg-red-600 hover:bg-red-800 text-white px-2 rounded"
                >
                  X
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add Item */}
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded mb-4"
        >
          + Add Item
        </button>

        {/* Amount Paid */}
        <div className="mb-4 grid md:flex">
          <label className="text-white min-w-[120px]">Amount Paid</label>
          <input
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleFormChange}
            className="p-2 bg-cyan-700 text-white rounded border border-cyan-600 w-full"
          />
        </div>

        {/* Summary */}
        <div className="text-white font-bold mb-4">
          Total Amount: {totalAmount} <br />
          Balance Remaining: {totalAmount - Number(formData.amountPaid)}
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
          >
            Submit Sale
          </button>
        </div>
      </form>
    </div>
  );
}
