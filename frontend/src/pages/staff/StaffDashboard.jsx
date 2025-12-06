import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import {
  fetchDashboardOverview,
  fetchDashboardLowStock,
  fetchDashboardStockSummary,
} from "../dashboard/dashboardSlice";

import {
  ShoppingCart,
  Warehouse,
  Activity,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function StaffDashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    overviewLoading,
    overviewError,
    totalProducts,
    todayStockIn,
    todayStockOut,
    lowStockLoading,
    lowStockError,
    lowStockItems = [],
    summaryLoading,
    summaryError,
    stockSummary = [],
  } = useSelector((state) => state.dashboard || {});

  // filters
  const [daysFilter, setDaysFilter] = useState(7);
  const [thresholdInput, setThresholdInput] = useState("");
  const [appliedThreshold, setAppliedThreshold] = useState(null);

  // initial overview
  useEffect(() => {
    dispatch(fetchDashboardOverview());
  }, [dispatch]);

  // low stock depends on applied threshold
  useEffect(() => {
    const thresholdNumber =
      appliedThreshold !== null && appliedThreshold !== ""
        ? Number(appliedThreshold)
        : undefined;
    dispatch(fetchDashboardLowStock(thresholdNumber));
  }, [dispatch, appliedThreshold]);

  // small summary for chart
  useEffect(() => {
    dispatch(fetchDashboardStockSummary(daysFilter));
  }, [dispatch, daysFilter]);

  // computed values
  const todayNetMovement = useMemo(
    () => todayStockIn - todayStockOut,
    [todayStockIn, todayStockOut]
  );

  const topLowStock = lowStockItems.slice(0, 5);

  const handleApplyThreshold = () => {
    setAppliedThreshold(thresholdInput || null);
  };

  const handleDaysChange = (days) => {
    setDaysFilter(days);
  };

  const quickActions = [
    {
      label: "Record Sale",
      icon: ShoppingCart,
      onClick: () => navigate("/sales"),
    },
    {
      label: "Stock Flow",
      icon: Activity,
      onClick: () => navigate("/stockflow"),
    },
    {
      label: "View Products",
      icon: Warehouse,
      onClick: () => navigate("/products"),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="bg-cyan-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
            <p className="text-cyan-200 text-sm">
              Quick view of today&apos;s stock activity, low stock alerts, and
              shortcuts to your main tasks.
            </p>
          </div>
        </div>

        {/* OVERVIEW ERRORS */}
        {overviewError && (
          <div className="bg-red-700 text-white text-sm px-3 py-2 rounded">
            {overviewError}
          </div>
        )}

        {/* TOP: THREE CARDS + QUICK ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Today Stock-In */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-cyan-300 text-sm">Stock-In Today</p>
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400">
              {overviewLoading ? "..." : todayStockIn}
            </p>
            <p className="text-xs text-cyan-400">
              Items added to inventory today.
            </p>
          </div>

          {/* Today Stock-Out */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-cyan-300 text-sm">Stock-Out Today</p>
              <ShoppingCart className="w-5 h-5 text-orange-300" />
            </div>
            <p className="text-3xl font-bold text-orange-300">
              {overviewLoading ? "..." : todayStockOut}
            </p>
            <p className="text-xs text-cyan-400">
              Items sold or removed from stock today.
            </p>
          </div>

          {/* Net Movement */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-cyan-300 text-sm">Net Movement</p>
              <ClipboardList className="w-5 h-5 text-teal-300" />
            </div>
            <p
              className={`text-3xl font-bold ${
                todayNetMovement >= 0 ? "text-green-400" : "text-orange-300"
              }`}
            >
              {overviewLoading ? "..." : todayNetMovement}
            </p>
            <p className="text-xs text-cyan-400">
              Positive = more stock-in than stock-out.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 flex flex-col gap-2">
            <p className="text-cyan-300 text-sm mb-1">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-cyan-800 hover:bg-teal-600 text-cyan-100 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* MIDDLE: LOW STOCK (COMPACT) */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Low Stock Alerts
                </h2>
                <p className="text-xs text-cyan-300">
                  Keep an eye on items that might run out soon.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value)}
                placeholder="Threshold (optional)"
                className="w-40 p-1.5 rounded bg-cyan-800 text-white border border-cyan-600 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                onClick={handleApplyThreshold}
                className="bg-blue-600 hover:bg-blue-800 text-white text-xs font-bold py-1 px-3 rounded"
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
            <p className="text-cyan-200 text-sm">
              Loading low stock information...
            </p>
          ) : topLowStock.length === 0 ? (
            <p className="text-cyan-200 text-sm">
              No low stock items right now. ✅
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm text-left">
                <thead>
                  <tr className="border-b border-cyan-700 text-cyan-200">
                    <th className="py-2 pr-3">Product</th>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3">Current</th>
                    <th className="py-2 pr-3">Min</th>
                  </tr>
                </thead>
                <tbody>
                  {topLowStock.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-cyan-800 hover:bg-cyan-800/60"
                    >
                      <td className="py-2 pr-3 text-white">{item.name}</td>
                      <td className="py-2 pr-3 text-cyan-100">{item.sku}</td>
                      <td className="py-2 pr-3 text-orange-300">
                        {item.currentQuantity}
                      </td>
                      <td className="py-2 pr-3 text-cyan-100">
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

        {/* BOTTOM: SMALL ACTIVITY CHART */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Stock Activity
              </h2>
              <p className="text-xs text-cyan-300">
                Stock-in vs stock-out for the last {daysFilter} days.
              </p>
            </div>

            <div className="inline-flex bg-cyan-950 rounded-full p-1 text-xs">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDaysChange(d)}
                  className={`px-3 py-1 rounded-full ${
                    daysFilter === d
                      ? "bg-teal-500 text-white"
                      : "text-cyan-200 hover:bg-cyan-800"
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>

          {summaryError && (
            <div className="bg-red-700 text-white text-sm px-3 py-2 rounded mb-3">
              {summaryError}
            </div>
          )}

          {summaryLoading ? (
            <p className="text-cyan-200 text-sm">Loading activity chart...</p>
          ) : stockSummary.length === 0 ? (
            <p className="text-cyan-200 text-sm">
              No stock movements recorded for this period.
            </p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stockSummary}
                  margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#164e63" />
                  <XAxis dataKey="date" stroke="#a5f3fc" fontSize={12} />
                  <YAxis stroke="#a5f3fc" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#22d3ee",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                    }}
                    labelStyle={{ color: "#e0f2fe" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="stockIn"
                    name="Stock-In"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="stockOut"
                    name="Stock-Out"
                    stroke="#fb923c"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
