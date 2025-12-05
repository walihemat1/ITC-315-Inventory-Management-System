import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLowStock,
  fetchStockInHistory,
  fetchStockOutHistory,
} from "./stockSlice";
import Layout from "../../components/Layout";

export default function StockFlowPage() {
  const dispatch = useDispatch();
  const {
    lowStockItems,
    lowStockLoading,
    lowStockError,
    stockIn,
    stockOut,
    historyLoading,
    historyError,
  } = useSelector((state) => state.stock);

  const [threshold, setThreshold] = useState("");

  useEffect(() => {
    dispatch(fetchLowStock());
    dispatch(fetchStockInHistory());
    dispatch(fetchStockOutHistory());
  }, [dispatch]);

  const handleApplyThreshold = () => {
    if (!threshold) {
      dispatch(fetchLowStock());
    } else {
      dispatch(fetchLowStock(Number(threshold)));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-cyan-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Stock Flow</h1>
            <p className="text-cyan-200 text-sm">
              Monitor low stock items and view stock-in / stock-out history.
            </p>
          </div>
        </div>

        {/* LOW STOCK SECTION */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold text-white">Low Stock</h2>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="Threshold (optional)"
                className="w-32 p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
              <button
                onClick={handleApplyThreshold}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Apply
              </button>
            </div>
          </div>

          {lowStockError && (
            <div className="bg-red-700 text-white text-sm px-3 py-2 rounded mb-3">
              {lowStockError}
            </div>
          )}

          {lowStockLoading ? (
            <p className="text-cyan-200">Loading low stock items...</p>
          ) : lowStockItems.length === 0 ? (
            <p className="text-cyan-200">No low stock items found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-cyan-700 text-cyan-200">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">SKU</th>
                    <th className="py-2 pr-4">Current Qty</th>
                    <th className="py-2 pr-4">Minimum Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-cyan-800 hover:bg-cyan-800/60"
                    >
                      <td className="py-2 pr-4 text-white">{item.name}</td>
                      <td className="py-2 pr-4 text-cyan-100">{item.sku}</td>
                      <td className="py-2 pr-4 text-orange-300">
                        {item.currentQuantity}
                      </td>
                      <td className="py-2 pr-4 text-cyan-100">
                        {item.minimumQuantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-cyan-300 md:hidden">
                Tip: Scroll horizontally to see all columns.
              </p>
            </div>
          )}
        </div>

        {/* HISTORY SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* STOCK IN */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              Stock In (Purchases)
            </h2>

            {historyError && (
              <div className="bg-red-700 text-white text-sm px-3 py-2 rounded mb-3">
                {historyError}
              </div>
            )}

            {historyLoading ? (
              <p className="text-cyan-200">Loading stock-in history...</p>
            ) : stockIn.length === 0 ? (
              <p className="text-cyan-200">No stock-in records.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs md:text-sm text-left">
                  <thead>
                    <tr className="border-b border-cyan-700 text-cyan-200">
                      <th className="py-2 pr-3">Product</th>
                      <th className="py-2 pr-3">Quantity</th>
                      <th className="py-2 pr-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockIn.map((log) => (
                      <tr
                        key={log._id}
                        className="border-b border-cyan-800 hover:bg-cyan-800/60"
                      >
                        <td className="py-2 pr-3 text-white">
                          {log.productId?.name || "-"}
                        </td>
                        <td className="py-2 pr-3 text-green-400">
                          +{log.quantity}
                        </td>
                        <td className="py-2 pr-3 text-cyan-100">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* STOCK OUT */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              Stock Out (Sales)
            </h2>

            {historyLoading ? (
              <p className="text-cyan-200">Loading stock-out history...</p>
            ) : stockOut.length === 0 ? (
              <p className="text-cyan-200">No stock-out records.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs md:text-sm text-left">
                  <thead>
                    <tr className="border-b border-cyan-700 text-cyan-200">
                      <th className="py-2 pr-3">Product</th>
                      <th className="py-2 pr-3">Quantity</th>
                      <th className="py-2 pr-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockOut.map((log) => (
                      <tr
                        key={log._id}
                        className="border-b border-cyan-800 hover:bg-cyan-800/60"
                      >
                        <td className="py-2 pr-3 text-white">
                          {log.productId?.name || "-"}
                        </td>
                        <td className="py-2 pr-3 text-red-400">
                          -{log.quantity}
                        </td>
                        <td className="py-2 pr-3 text-cyan-100">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
