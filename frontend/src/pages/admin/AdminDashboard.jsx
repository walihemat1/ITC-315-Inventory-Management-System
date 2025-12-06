// src/pages/admin/AdminDashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import {
  fetchDashboardOverview,
  fetchDashboardLowStock,
  fetchDashboardStockSummary,
} from "../dashboard/dashboardSlice";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const dispatch = useDispatch();

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

  // stock summary depends on daysFilter
  useEffect(() => {
    dispatch(fetchDashboardStockSummary(daysFilter));
  }, [dispatch, daysFilter]);

  // Today in/out % for mini ratio bar
  const { inPercent, outPercent } = useMemo(() => {
    const total = todayStockIn + todayStockOut;
    if (total === 0) return { inPercent: 0, outPercent: 0 };
    const ip = Math.round((todayStockIn / total) * 100);
    return { inPercent: ip, outPercent: 100 - ip };
  }, [todayStockIn, todayStockOut]);

  // top low stock items (just 5 for dashboard)
  const topLowStock = lowStockItems.slice(0, 5);

  // insights over the stockSummary array
  const stockInsights = useMemo(() => {
    if (!stockSummary.length)
      return {
        totalInLastNDays: 0,
        totalOutLastNDays: 0,
        bestInDay: null,
        bestOutDay: null,
      };

    let totalIn = 0;
    let totalOut = 0;
    let bestInDay = stockSummary[0];
    let bestOutDay = stockSummary[0];

    for (const day of stockSummary) {
      totalIn += day.stockIn || 0;
      totalOut += day.stockOut || 0;
      if ((day.stockIn || 0) > (bestInDay.stockIn || 0)) bestInDay = day;
      if ((day.stockOut || 0) > (bestOutDay.stockOut || 0)) bestOutDay = day;
    }

    return {
      totalInLastNDays: totalIn,
      totalOutLastNDays: totalOut,
      bestInDay,
      bestOutDay,
    };
  }, [stockSummary]);

  const handleApplyThreshold = () => {
    setAppliedThreshold(thresholdInput || null);
  };

  const handleDaysChange = (days) => {
    setDaysFilter(days);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="bg-cyan-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-cyan-200 text-sm">
              Overview of products, stock movements, low stock alerts, and
              activity trends.
            </p>
          </div>
        </div>

        {/* OVERVIEW ERRORS */}
        {overviewError && (
          <div className="bg-red-700 text-white text-sm px-3 py-2 rounded">
            {overviewError}
          </div>
        )}

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Products */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-cyan-300 text-sm">Total Products</p>
              <Activity className="w-5 h-5 text-teal-300" />
            </div>
            <p className="text-3xl font-bold text-white">
              {overviewLoading ? "..." : totalProducts}
            </p>
            <p className="text-xs text-cyan-400">
              All active items currently in your catalog.
            </p>
          </div>

          {/* Today Stock-In */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-cyan-300 text-sm">Stock-In Today</p>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400">
              {overviewLoading ? "..." : todayStockIn}
            </p>
            <p className="text-xs text-cyan-400">
              Total quantity received or purchased today.
            </p>
          </div>

          {/* Today Stock-Out */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-cyan-300 text-sm">Stock-Out Today</p>
              <TrendingDown className="w-5 h-5 text-orange-300" />
            </div>
            <p className="text-3xl font-bold text-orange-300">
              {overviewLoading ? "..." : todayStockOut}
            </p>
            <p className="text-xs text-cyan-400">
              Total quantity sold or used today.
            </p>
          </div>
        </div>

        {/* MINI RATIO BAR + SUMMARY INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Ratio bar */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">
                Today&apos;s Stock Movement
              </h2>
              <span className="text-xs text-cyan-300">
                In vs Out ratio for today
              </span>
            </div>

            {overviewLoading ? (
              <p className="text-cyan-200">Calculating...</p>
            ) : todayStockIn + todayStockOut === 0 ? (
              <p className="text-cyan-200 text-sm">
                No stock movement recorded for today.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-cyan-200">
                  <span>Stock-In: {todayStockIn}</span>
                  <span>Stock-Out: {todayStockOut}</span>
                </div>

                <div className="w-full h-4 bg-cyan-950 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${inPercent}%` }}
                  />
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${outPercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-cyan-300">
                  <span>In: {inPercent}%</span>
                  <span>Out: {outPercent}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Summary insights for last N days */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-white">
                Last {daysFilter} Days Summary
              </h2>

              {/* Filter chips for days */}
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

            {summaryLoading ? (
              <p className="text-cyan-200 text-sm">Loading summary...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-cyan-950/70 rounded-md p-3">
                  <p className="text-cyan-300 text-xs mb-1">
                    Total Stock-In ({daysFilter}d)
                  </p>
                  <p className="text-xl font-bold text-green-400">
                    {stockInsights.totalInLastNDays}
                  </p>
                </div>
                <div className="bg-cyan-950/70 rounded-md p-3">
                  <p className="text-cyan-300 text-xs mb-1">
                    Total Stock-Out ({daysFilter}d)
                  </p>
                  <p className="text-xl font-bold text-orange-300">
                    {stockInsights.totalOutLastNDays}
                  </p>
                </div>
                <div className="bg-cyan-950/70 rounded-md p-3">
                  <p className="text-cyan-300 text-xs mb-1">Net Movement</p>
                  <p
                    className={`text-xl font-bold ${
                      stockInsights.totalInLastNDays -
                        stockInsights.totalOutLastNDays >=
                      0
                        ? "text-green-400"
                        : "text-orange-300"
                    }`}
                  >
                    {stockInsights.totalInLastNDays -
                      stockInsights.totalOutLastNDays}
                  </p>
                </div>

                {stockInsights.bestInDay && (
                  <div className="bg-cyan-950/70 rounded-md p-3 md:col-span-2">
                    <p className="text-cyan-300 text-xs mb-1">
                      Best Stock-In Day
                    </p>
                    <p className="text-sm text-cyan-100">
                      {stockInsights.bestInDay.date}:{" "}
                      <span className="text-green-400 font-semibold">
                        {stockInsights.bestInDay.stockIn}
                      </span>{" "}
                      units
                    </p>
                  </div>
                )}

                {stockInsights.bestOutDay && (
                  <div className="bg-cyan-950/70 rounded-md p-3">
                    <p className="text-cyan-300 text-xs mb-1">
                      Highest Stock-Out Day
                    </p>
                    <p className="text-sm text-cyan-100">
                      {stockInsights.bestOutDay.date}:{" "}
                      <span className="text-orange-300 font-semibold">
                        {stockInsights.bestOutDay.stockOut}
                      </span>{" "}
                      units
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* LOWER SECTION: Low Stock + 7-Day Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LOW STOCK LIST WITH THRESHOLD FILTER */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Low Stock Items
                </h2>
                <p className="text-xs text-cyan-300">
                  Showing up to 5 items below minimum quantity or custom
                  threshold.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(e.target.value)}
                  placeholder="Threshold"
                  className="w-28 p-1.5 rounded bg-cyan-800 text-white border border-cyan-600 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
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
              <p className="text-cyan-200">Loading low stock items...</p>
            ) : topLowStock.length === 0 ? (
              <p className="text-cyan-200 text-sm">
                Great! No low stock items at the moment.
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

          {/* STOCK SUMMARY CHART (LINE + BAR) */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <h2 className="text-xl font-semibold text-white">
                Stock Activity Chart
              </h2>
              <p className="text-xs text-cyan-300">
                Visual stock-in vs stock-out for the last {daysFilter} days.
              </p>
            </div>

            {summaryError && (
              <div className="bg-red-700 text-white text-sm px-3 py-2 rounded mb-3">
                {summaryError}
              </div>
            )}

            {summaryLoading ? (
              <p className="text-cyan-200">Loading chart...</p>
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

            {/* Small bar chart below, reusing data */}
            {!summaryLoading && stockSummary.length > 0 && (
              <div className="h-28 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stockSummary}
                    margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#22d3ee",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                      }}
                    />
                    <Bar dataKey="stockIn" name="In" fill="#22c55e" />
                    <Bar dataKey="stockOut" name="Out" fill="#fb923c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
