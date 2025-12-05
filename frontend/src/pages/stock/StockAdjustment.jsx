import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../app/axiosClient";
import { adjustStock } from "./stockSlice";
import Layout from "../../components/Layout";

export default function StockAdjustmentPage() {
  const dispatch = useDispatch();
  const { adjusting, adjustError, lastAdjustedProduct } = useSelector(
    (state) => state.stock
  );

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [currentQty, setCurrentQty] = useState(0);
  const [newQuantity, setNewQuantity] = useState("");
  const [reason, setReason] = useState("");

  // Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products for adjustment:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (e) => {
    const id = e.target.value;
    setSelectedProductId(id);
    const product = products.find((p) => p._id === id);
    if (product) {
      setCurrentQty(product.currentQuantity || 0);
      setNewQuantity(product.currentQuantity || 0);
    } else {
      setCurrentQty(0);
      setNewQuantity("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
      await dispatch(
        adjustStock({
          productId: selectedProductId,
          newQuantity: Number(newQuantity),
          reason,
        })
      ).unwrap();

      alert("Stock adjusted successfully");
      setReason("");
    } catch (err) {
      console.error("Adjust stock error:", err);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-cyan-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Stock Adjustment</h1>
            <p className="text-cyan-200 text-sm">
              Adjust product stock levels manually (admin & staff).
            </p>
          </div>
        </div>

        {/* Error */}
        {adjustError && (
          <div className="bg-red-700 text-white text-sm px-3 py-2 rounded">
            {adjustError}
          </div>
        )}

        {/* Form */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Product */}
            <div className="md:col-span-1">
              <label className="block text-cyan-100 text-sm mb-1">
                Product
              </label>
              <select
                value={selectedProductId}
                onChange={handleProductChange}
                required
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (SKU: {p.sku})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Quantity */}
            <div>
              <label className="block text-cyan-100 text-sm mb-1">
                Current Quantity
              </label>
              <input
                type="number"
                value={currentQty}
                readOnly
                className="w-full p-2 rounded bg-gray-700 text-white border border-cyan-600"
              />
            </div>

            {/* New Quantity */}
            <div>
              <label className="block text-cyan-100 text-sm mb-1">
                New Quantity
              </label>
              <input
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                required
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* Reason */}
            <div className="md:col-span-2">
              <label className="block text-cyan-100 text-sm mb-1">
                Reason / Notes
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="e.g. Manual correction, damaged items, inventory count adjustment..."
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={adjusting || !selectedProductId}
                className="bg-green-600 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
              >
                {adjusting ? "Adjusting..." : "Adjust Stock"}
              </button>
            </div>
          </form>

          {lastAdjustedProduct && (
            <p className="mt-4 text-xs text-cyan-300">
              Last adjusted:{" "}
              <span className="font-semibold">
                {lastAdjustedProduct.name} (Qty:{" "}
                {lastAdjustedProduct.currentQuantity})
              </span>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
