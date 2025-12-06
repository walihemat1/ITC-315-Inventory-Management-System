import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../app/axiosClient";

export default function AddSales({ Customers = [], onSaleAdded }) {
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    customerId: "",
    amountPaid: 0,
    paymentMethod: "cash",
    notes: "",
  });

  const [items, setItems] = useState([
    { productId: "", quantity: 1, price: 0, total: 0 },
  ]);

  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axiosClient.get("/api/products");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const sum = items.reduce((acc, item) => acc + Number(item.total || 0), 0);
    setSubtotal(sum);
  }, [items]);

  const totalAmount = subtotal;
  const balanceRemaining = totalAmount - Number(formData.amountPaid || 0);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amountPaid" ? Number(value || 0) : value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];

    if (field === "quantity" || field === "price") {
      updated[index][field] = Number(value || 0);
    } else {
      updated[index][field] = value;
    }

    if (field === "quantity" || field === "price") {
      const qty = Number(updated[index].quantity || 0);
      const price = Number(updated[index].price || 0);
      updated[index].total = qty * price;
    }

    setItems(updated);
  };

  const handleProductSelect = (index, e) => {
    const productId = e.target.value;
    const selectedProduct = products.find((p) => p._id === productId);

    const updated = [...items];
    updated[index].productId = productId;

    if (selectedProduct) {
      const price = Number(selectedProduct.sellingPrice || 0);
      const qty = Number(updated[index].quantity || 1);
      updated[index].price = price;
      updated[index].total = price * qty;
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // required by backend
    if (!user?._id && !user?.id) {
      alert("Missing sellerId (user not loaded). Please log in again.");
      return;
    }

    if (!formData.customerId) {
      alert("Customer is required. Please select a customer.");
      return;
    }

    const validItems = items.filter(
      (i) => i.productId && Number(i.quantity) > 0
    );

    if (validItems.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    const payload = {
      sellerId: user?._id || user?.id,
      customerId: formData.customerId,
      items: validItems.map((i) => ({
        productId: i.productId,
        quantity: Number(i.quantity),
        price: Number(i.price),
        total: Number(i.total),
      })),
      totalAmount: Number(totalAmount),
      amountPaid: Number(formData.amountPaid),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes || "",
    };

    console.log("SALE PAYLOAD ===>", payload);

    try {
      const res = await axiosClient.post("/api/sales/create", payload, {
        withCredentials: true,
      });

      alert("Sale added successfully!");
      if (onSaleAdded) onSaleAdded(res.data);

      // reset
      setFormData({
        customerId: "",
        amountPaid: 0,
        paymentMethod: "cash",
        notes: "",
      });
      setItems([{ productId: "", quantity: 1, price: 0, total: 0 }]);
    } catch (err) {
      console.error("Error submitting sale:", err);
      console.error("Backend error:", err?.response?.data);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to submit sale";
      alert(msg);
    }
  };

  return (
    <div className="my-6 p-6 bg-cyan-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white mb-4">Add Sale</h2>
      <div className="border-b mb-4 border-cyan-600"></div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* CUSTOMER */}
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
            {Customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* PAYMENT / AMOUNT PAID */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid md:flex">
            <label className="text-white min-w-[120px]">Payment</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleFormChange}
              className="p-2 bg-cyan-700 text-white rounded border border-cyan-600 w-full"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <div className="grid md:flex">
            <label className="text-white min-w-[120px]">Amount Paid</label>
            <input
              type="number"
              name="amountPaid"
              value={formData.amountPaid}
              onChange={handleFormChange}
              className="p-2 bg-cyan-700 text-white rounded border border-cyan-600 w-full"
            />
          </div>
        </div>

        {/* NOTES */}
        <div className="grid md:flex">
          <label className="text-white min-w-[120px]">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleFormChange}
            rows={2}
            className="p-2 bg-cyan-700 text-white rounded border border-cyan-600 w-full"
            placeholder="Any remarks, reference, etc."
          />
        </div>

        {/* ITEMS */}
        <h3 className="text-white mt-6 mb-2 font-semibold">Items</h3>

        {items.map((item, index) => (
          <div
            key={index}
            className="mb-4 p-3 bg-cyan-700 rounded border border-cyan-600"
          >
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
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="p-2 rounded bg-cyan-600 text-white"
                placeholder="Qty"
              />

              {/* Price */}
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                className="p-2 rounded bg-cyan-600 text-white"
                placeholder="Price"
              />

              {/* Total */}
              <input
                type="number"
                readOnly
                value={item.total}
                className="p-2 rounded bg-gray-500 text-white"
                placeholder="Total"
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

        {/* SUMMARY */}
        <div className="text-white font-bold mb-4 space-y-1">
          <p>Subtotal: {subtotal.toFixed(2)}</p>
          <p>Total Amount: {totalAmount.toFixed(2)}</p>
          <p>Balance Remaining: {balanceRemaining.toFixed(2)}</p>
        </div>

        {/* SUBMIT */}
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
