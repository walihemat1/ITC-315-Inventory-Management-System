// src/pages/ReportsPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovementReport, fetchLowStockReport } from "./reportsSlice";
import Layout from "../../components/Layout";

const API_BASE = "http://localhost:5000"; // adjust if needed

export default function ReportsPage() {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);

  const {
    movements,
    movementLoading,
    movementError,
    lowStock,
    lowStockLoading,
    lowStockError,
  } = useSelector((state) => state.reports);

  // Filters
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [threshold, setThreshold] = useState("");

  // initial load
  useEffect(() => {
    dispatch(fetchMovementReport({}));
    dispatch(fetchLowStockReport({}));
  }, [dispatch]);

  const handleApplyMovements = () => {
    dispatch(
      fetchMovementReport({
        start: start || undefined,
        end: end || undefined,
      })
    );
  };

  const handleApplyLowStock = () => {
    dispatch(
      fetchLowStockReport({
        threshold: threshold ? Number(threshold) : undefined,
      })
    );
  };

  // Admin-only: download PDFs by opening the URL in a new tab
  const handleDownloadMovementPdf = () => {
    const params = new URLSearchParams();
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    const url = `${API_BASE}/api/report/movements/pdf?${params.toString()}`;
    window.open(url, "_blank");
  };

  const handleDownloadLowStockPdf = () => {
    const params = new URLSearchParams();
    if (threshold) params.append("threshold", threshold);
    const url = `${API_BASE}/api/report/low-stock/pdf?${params.toString()}`;
    window.open(url, "_blank");
  };

  const isAdmin = role?.toLowerCase() === "admin";

  return (
    <Layout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="bg-cyan-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Reports</h1>
            <p className="text-cyan-200 text-sm">
              View stock movements and low-stock snapshots. Admins can export
              PDF reports.
            </p>
          </div>
        </div>

        {/* MOVEMENT REPORT */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Stock Movement Report
              </h2>
              <p className="text-cyan-200 text-sm">
                Filter by date range to see purchases, sales and adjustments.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <div className="flex gap-2">
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="p-2 rounded bg-cyan-800 text-white border border-cyan-600 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="p-2 rounded bg-cyan-800 text-white border border-cyan-600 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <button
                onClick={handleApplyMovements}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Apply
              </button>
              {isAdmin && (
                <button
                  onClick={handleDownloadMovementPdf}
                  className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Export PDF
                </button>
              )}
            </div>
          </div>

          {movementError && (
            <div className="bg-red-700 text-white text-sm px-3 py-2 rounded">
              {movementError}
            </div>
          )}

          {movementLoading ? (
            <p className="text-cyan-200">Loading movement report...</p>
          ) : movements.length === 0 ? (
            <p className="text-cyan-200">
              No movement records for this period.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm text-left">
                <thead>
                  <tr className="border-b border-cyan-700 text-cyan-200">
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Type</th>
                    <th className="py-2 pr-3">Product</th>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3">Qty</th>
                    <th className="py-2 pr-3">Prev</th>
                    <th className="py-2 pr-3">New</th>
                    <th className="py-2 pr-3">Reason / Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-cyan-800 hover:bg-cyan-800/60"
                    >
                      <td className="py-2 pr-3 text-cyan-100">
                        {new Date(m.date).toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-white">{m.type}</td>
                      <td className="py-2 pr-3 text-white">{m.product}</td>
                      <td className="py-2 pr-3 text-cyan-100">
                        {m.sku || "-"}
                      </td>
                      <td className="py-2 pr-3 text-orange-300">
                        {m.quantity}
                      </td>
                      <td className="py-2 pr-3 text-cyan-100">
                        {m.previousStock ?? "-"}
                      </td>
                      <td className="py-2 pr-3 text-cyan-100">
                        {m.newStock ?? "-"}
                      </td>
                      <td className="py-2 pr-3 text-cyan-100">
                        {m.reason || m.referenceId || "-"}
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

        {/* LOW STOCK REPORT */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Low Stock Report
              </h2>
              <p className="text-cyan-200 text-sm">
                View items below minimum quantity or a custom threshold.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <input
                type="number"
                min="1"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="Threshold (optional)"
                className="w-40 p-2 rounded bg-cyan-800 text-white border border-cyan-600 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                onClick={handleApplyLowStock}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Apply
              </button>
              {isAdmin && (
                <button
                  onClick={handleDownloadLowStockPdf}
                  className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Export PDF
                </button>
              )}
            </div>
          </div>

          {lowStockError && (
            <div className="bg-red-700 text-white text-sm px-3 py-2 rounded">
              {lowStockError}
            </div>
          )}

          {lowStockLoading ? (
            <p className="text-cyan-200">Loading low stock report...</p>
          ) : lowStock.length === 0 ? (
            <p className="text-cyan-200">No low-stock items found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm text-left">
                <thead>
                  <tr className="border-b border-cyan-700 text-cyan-200">
                    <th className="py-2 pr-3">Product</th>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3">Qty</th>
                    <th className="py-2 pr-3">Min Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-cyan-800 hover:bg-cyan-800/60"
                    >
                      <td className="py-2 pr-3 text-white">{p.name}</td>
                      <td className="py-2 pr-3 text-cyan-100">
                        {p.sku || "-"}
                      </td>
                      <td className="py-2 pr-3 text-orange-300">
                        {p.currentQuantity}
                      </td>
                      <td className="py-2 pr-3 text-cyan-100">
                        {p.minimumQuantity}
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
      </div>
    </Layout>
  );
}
