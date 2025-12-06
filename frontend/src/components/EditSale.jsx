import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditSalePage({ Sale, onEditSale, Customers }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    customerId: "",
    editedBy: user.id,
    invoiceNumber: "",
    date: "",
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    totalAmount: 0,
    amountPaid: 0,
    paymentMethod: "cash",
    notes: "",
  });

  // ---------- LOAD EXISTING SALE ----------
  useEffect(() => {
    if (!Sale) return;

    setFormData({
      customerId: Sale.customerId?._id || "",
      editedBy: user.id,
      invoiceNumber: Sale.invoiceNumber || "",
      date: Sale.date ? Sale.date.substring(0, 10) : "",
      items: Sale.items.map(item => ({
        productId: item.productId?._id || item.productId,  // convert populated object → ID
        quantity: item.quantity || 0,
        unitCost: item.unitCost || 0,
        totalCost: item.totalCost || (item.quantity * item.unitCost)
      })),
      subtotal: Sale.subtotal || 0,
      tax: Sale.tax || 0,
      discount: Sale.discount || 0,
      totalAmount: Sale.totalAmount || 0,
      amountPaid: Sale.amountPaid || 0,
      paymentMethod: Sale.paymentMethod || "cash",
      notes: Sale.notes || "",
    });
  }, [Sale]);

  // ---------- FETCH PRODUCTS ----------
  useEffect(() => {
    fetch("http://localhost:5000/api/products", { credentials: "include" })
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // ------- ITEM FIELD CHANGE -------
  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;

    if (field === "quantity" || field === "price") {
      updated[index].total =
        Number(updated[index].quantity || 0) * Number(updated[index].price || 0);
    }

    setFormData((prev) => ({ ...prev, items: updated }));
    calculateTotals(updated);
  };

  const handleProductSelect = (index, productId) => {
    const selected = products.find((p) => p._id === productId);

    const updated = [...formData.items];
    updated[index].productId = productId;
    updated[index].price = selected?.sellingPrice || 0;
    updated[index].total =
      updated[index].quantity * updated[index].price;

    setFormData((prev) => ({ ...prev, items: updated }));
    calculateTotals(updated);
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, price: 0, total: 0 }],
    }));
  };

  const removeItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updated }));
    calculateTotals(updated);
  };

  // -------- TOTALS ----------
  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const total =
      subtotal + Number(formData.tax) - Number(formData.discount);

    setFormData((prev) => ({
      ...prev,
      subtotal,
      totalAmount: total,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Sale?._id) {
      alert("Sale ID missing!");
      console.log("Sale object:", Sale);
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/sales/${Sale._id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("Sale updated successfully!");
      onEditSale(result);
      navigate("/Sales");
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async () => {
    if (!Sale?._id) return alert("Sale ID missing!");

    const response = await fetch(
      `http://localhost:5000/api/sales/${Sale._id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("Sale deleted successfully!");
      onEditSale(result);
      navigate("/Sales");
    } else {
      alert(result.message);
    }
  };

  if (!Sale) return <p className="text-white p-6">Loading...</p>;

  // --------- UI ----------
  return (
    <div className="my-6 p-6 bg-cyan-800 rounded-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Edit Sale</h1>
      <form onSubmit={handleSubmit} className="bg-cyan-900 rounded-lg p-6">
        
        {/* Customer */}
        <div className="mb-4">
          <label className="text-white block mb-1">Customer</label>
          <select
            value={formData.customerId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customerId: e.target.value }))
            }
            className="w-full p-2 bg-cyan-700 text-white border"
            required
          >
            <option value="">Select Customer</option>
            {Customers?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
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
            required
          />
        </div>

        {/* ITEMS */}
        <h2 className="text-xl text-white mb-2">Items</h2>
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 bg-cyan-800 p-3 rounded mb-2">

            {/* Product */}
            <select
              value={item.productId}
              onChange={(e) => handleProductSelect(index, e.target.value)}
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

            {/* Qty */}
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              className="p-2 bg-cyan-700 text-white rounded"
            />

            {/* Price */}
            <input
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              className="p-2 bg-cyan-700 text-white rounded"
            />

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="bg-red-600 text-white rounded px-3"
            >
              X
            </button>

            <div className="col-span-4 text-right text-white">
              Line Total: {item.total}
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

        {/* FINANCIAL FIELDS */}
        <div className="grid grid-cols-2 gap-4 text-white">
          <div>
            <label>Tax</label>
            <input
              type="number"
              value={formData.tax}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tax: Number(e.target.value) }))
              }
              className="w-full p-2 bg-cyan-700 text-white border"
            />
          </div>

          <div>
            <label>Discount</label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, discount: Number(e.target.value) }))
              }
              className="w-full p-2 bg-cyan-700 text-white border"
            />
          </div>
        </div>

        <div className="text-white mt-4">
          <p>Subtotal: {formData.subtotal}</p>
          <p>Total Amount: {formData.totalAmount}</p>
        </div>

        {/* Payment */}
        <div className="mt-4">
          <label className="text-white block mb-1">Amount Paid</label>
          <input
            type="number"
            value={formData.amountPaid}
            onChange={(e) => handlePaidChange(e.target.value)}
            className="w-full p-2 bg-cyan-700 text-white border"
          />
        </div>

        {/* Payment Method */}
        <div className="mt-4">
          <label className="text-white block mb-1">Payment Method</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))
            }
            className="w-full p-2 bg-cyan-700 text-white border"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mobile">Mobile Transfer</option>
          </select>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="text-white block mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            className="w-full p-2 bg-cyan-700 text-white border"
          />
        </div>

        <div className="flex gap-2 justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-800 text-white px-6 py-2 rounded mt-6"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-800 text-white px-6 py-2 rounded mt-6"
          >
            Delete
          </button>
        </div>

      </form>
    </div>
  );
}
