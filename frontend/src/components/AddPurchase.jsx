import React, { useState, useEffect } from "react";

export default function AddPurchases({ suppliers = [], onPurchaseAdded }) {

  const [formData, setFormData] = useState({
    supplierId: "",
    date: "",
    amountPaid: 0,
  });

  const [items, setItems] = useState([
    { productId: "", quantity: 1, unitCost: 0, totalCost: 0 },
  ]);

  const [Products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };

    fetchProducts();
  }, []);


  const [totalAmount, setTotalAmount] = useState(0);

  // ----------------------------------
  // Recalculate total
  // ----------------------------------
  useEffect(() => {
    const sum = items.reduce((acc, item) => acc + Number(item.totalCost || 0), 0);
    setTotalAmount(sum);
  }, [items]);

  // ----------------------------------
  // Handle form data change
  // ----------------------------------
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ----------------------------------
  // Handle item row updates
  // ----------------------------------
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "quantity" || field === "unitCost") {
      const qty = Number(updated[index].quantity || 0);
      const cost = Number(updated[index].unitCost || 0);
      updated[index].totalCost = qty * cost;
    }

    setItems(updated);
  };

  // ----------------------------------
  // Add new item row
  // ----------------------------------
  const addItem = () => {
    setItems([
      ...items,
      { productId: "", quantity: 1, unitCost: 0, totalCost: 0 },
    ]);
  };

  // ----------------------------------
  // Remove item row
  // ----------------------------------
  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // ----------------------------------
  // Submit purchase
  // ----------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      supplierId: formData.supplierId,
      date: formData.date || new Date(),
      items,
      totalAmount,
      amountPaid: Number(formData.amountPaid),
      balanceRemaining: totalAmount - Number(formData.amountPaid),
    };

    try {
      const res = await fetch("http://localhost:5000/api/purchases/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Purchase Added Successfully!");
        onPurchaseAdded(result);

        // Reset form
        setFormData({
          supplierId: "",
          date: "",
          amountPaid: 0,
        });

        setItems([{ productId: "", quantity: 1, unitCost: 0, totalCost: 0 }]);
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error("Error adding purchase:", err);
      alert("Error submitting purchase");
    }
  };
  const handleProductSelect = (index, e) => {
  const productId = e.target.value;
  const selectedProduct = Products.find(p => p._id === productId);

  handleItemChange(index, "productId", productId);
  
  if (selectedProduct) {
    handleItemChange(index, "unitCost", selectedProduct.sellingPrice);

    // auto-update totalCost
    handleItemChange(
      index,
      "totalCost",
      selectedProduct.sellingPrice * items[index].quantity
    );
  }
};


  return (
    <div className="my-6 p-6 bg-cyan-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white mb-4">Add Purchase</h2>
      <div className="border-b"></div>

      <form className="mt-4" onSubmit={handleSubmit}>

        {/* Supplier */}
        <div className="mb-4 grid md:flex">
          <label className="text-white min-w-[120px]">Supplier</label>
          <select
            name="supplierId"
            value={formData.supplierId}
            onChange={handleFormChange}
            required
            className="p-2 bg-cyan-700 text-white rounded border border-cyan-600 w-full"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
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

        {/* ITEMS TABLE */}
        <h3 className="text-white mt-6 mb-2 font-semibold">Items</h3>

        {items.map((item, index) => (
          <div
            key={index}
            className="mb-4 p-3 bg-cyan-700 rounded border border-cyan-600"
          >
            <div className="grid md:grid-cols-5 gap-3">

              {/* Product */}
              <label name="name">Name</label>
              <select
                value={item.productId}
                onChange={(e) => handleProductSelect(index, e)}
                required
                className="p-2 rounded bg-cyan-600 text-white"
              >
                <option value="">Product</option>
                {Products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>


              {/* Qty */}
              <label name="quantity">Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                min="1"
                className="p-2 rounded bg-cyan-600 text-white"
                placeholder="Qty"
              />

              {/* Unit Cost */}
              <label name="unitCost">Unit Cost</label>
              <input
                id="unitCost"
                type="number"
                value={item.unitCost}
                onChange={(e) =>
                  handleItemChange(index, "unitCost", e.target.value)
                }
                className="p-2 rounded bg-cyan-600 text-white"
                placeholder="Unit Cost"
              />

              {/* Total Cost */}
              <label name="totalCost">Total Cost</label>
              <input
                type="number"
                value={item.totalCost}
                readOnly
                className="p-2 rounded bg-gray-500 text-white"
              />

              {/* Remove Button */}
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
            Submit Purchase
          </button>
        </div>
      </form>
    </div>
  );
}
