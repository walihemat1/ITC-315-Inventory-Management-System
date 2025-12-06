import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditPurchasePage({ Purchase, onEditPurchase, Suppliers }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    updatedBy: user.id,
    supplierId: "",
    invoiceNumber: "",
    date: "",
    items: [],
    totalAmount: 0,
    amountPaid: 0,
    balanceRemaining: 0,
  });

  // =============== IMPORTANT: LOAD EXISTING PURCHASE =============== //
useEffect(() => {
  if (!Purchase) return;

  setFormData({
    updatedBy: user.id,
    supplierId: Purchase.supplierId?._id || "",
    invoiceNumber: Purchase.invoiceNumber || "",
    date: Purchase.date ? Purchase.date.substring(0, 10) : "",
    items: Purchase.items.map(item => ({
      productId: item.productId?._id || item.productId,  // convert populated object → ID
      quantity: item.quantity || 0,
      unitCost: item.unitCost || 0,
      totalCost: item.totalCost || (item.quantity * item.unitCost)
    })),
    totalAmount: Purchase.totalAmount || 0,
    amountPaid: Purchase.amountPaid || 0,
    balanceRemaining: Purchase.balanceRemaining || 0,
  });
}, [Purchase]);


  // ================= FETCH PRODUCTS ================= //
  useEffect(() => {
    fetch("http://localhost:5000/api/products",{
      credentials: "include"
    })
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // ================= ITEM HANDLERS ================= //
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "unitCost") {
      const qty = Number(updatedItems[index].quantity || 0);
      const cost = Number(updatedItems[index].unitCost || 0);
      updatedItems[index].totalCost = qty * cost;
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems, formData.amountPaid);
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, unitCost: 0, totalCost: 0 }],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems, formData.amountPaid);
  };

  const calculateTotals = (items, paid) => {
    const total = items.reduce((sum, item) => sum + Number(item.totalCost || 0), 0);
    const balance = total - Number(paid || 0);

    setFormData((prev) => ({
      ...prev,
      totalAmount: total,
      balanceRemaining: balance,
    }));
  };

  const handlePaidChange = (value) => {
    calculateTotals(formData.items, value);
    setFormData((prev) => ({ ...prev, amountPaid: value }));
  };

  // ================= SUBMIT ================= //
  const id = Purchase._id;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5000/api/purchase/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Purchase updated!");
      onEditPurchase(result);       // run your callback
      navigate("/admin/purchases");
    } else {
      alert(result.message);
    }
  };
  const deletePurchase = async (e) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/purchase/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("purchase deleted successfully!");
        navigate("purchases");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
      alert("Error deleting purchase");
    }
  };

  if (!Purchase) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="my-6 p-6 bg-cyan-800 rounded-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Edit Purchase</h1>

      <form onSubmit={handleSubmit} className="bg-cyan-900 rounded-lg p-6">

        {/* Supplier */}
        <div className="mb-4">
          <label className="text-white block mb-1">Supplier</label>
          <select
            value={formData.supplierId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, supplierId: e.target.value }))
            }
            className="w-full p-2 bg-cyan-700 text-white border"
            required
          >
            <option value="">Select Supplier</option>
            {Suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Invoice Number */}
        <div className="mb-4">
          <label className="text-white block mb-1">Invoice Number</label>
          <input
            type="text"
            value={formData.invoiceNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, invoiceNumber: e.target.value }))
            }
            className="w-full p-2 bg-cyan-700 text-white border"
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="text-white block mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full p-2 bg-cyan-700 text-white border"
          />
        </div>

        {/* ITEMS */}
        <h2 className="text-xl text-white mb-2">Items</h2>

        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 bg-cyan-800 p-3 rounded mb-2">

            {/* Product */}
            <select
              value={item.productId}
              onChange={(e) =>
                handleItemChange(index, "productId", e.target.value)
              }
              className="p-2 bg-cyan-700 text-white rounded"
              required
            >
              <option value="">Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Quantity */}
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="p-2 bg-cyan-700 text-white rounded"
              placeholder="Qty"
            />

            {/* Unit Cost */}
            <input
              type="number"
              value={item.unitCost}
              onChange={(e) =>
                handleItemChange(index, "unitCost", e.target.value)
              }
              className="p-2 bg-cyan-700 text-white rounded"
              placeholder="Unit Cost"
            />

            {/* Remove Item */}
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="bg-red-600 text-white rounded px-3"
            >
              X
            </button>

            <div className="col-span-4 text-right text-white">
              Line Total: {item.totalCost}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          + Add Item
        </button>

        {/* AMOUNTS */}
        <div className="mb-4 text-white">
          <p>Total Amount: {formData.totalAmount}</p>
        </div>

        <div className="mb-4">
          <label className="text-white block mb-1">Amount Paid</label>
          <input
            type="number"
            value={formData.amountPaid}
            onChange={(e) => handlePaidChange(e.target.value)}
            className="w-full p-2 bg-cyan-700 text-white border"
          />
        </div>

        <div className="mb-4 text-white">
          <p>Balance Remaining: {formData.balanceRemaining}</p>
        </div>

        <div className="flex gap-2 justify-center">
          <button type="submit" className="bg-green-600 hover:bg-green-800 text-white px-6 py-2 rounded">
          Save Changes
        </button>
        <button onClick={()=>deletePurchase()} className="bg-red-600 hover:bg-red-800 text-white px-6 py-2 rounded">
          Delete
        </button>
        </div>
      </form>
    </div>
  );
}
