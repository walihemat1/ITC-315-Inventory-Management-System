import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../app/axiosClient";

// GET total products + today's stock-in + today's stock-out in one go
export const fetchDashboardOverview = createAsyncThunk(
  "dashboard/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const [totalRes, inRes, outRes] = await Promise.all([
        axiosClient.get("/api/dashboard/total-products"),
        axiosClient.get("/api/dashboard/today-stock-in"),
        axiosClient.get("/api/dashboard/today-stock-out"),
      ]);

      return {
        totalProducts: totalRes.data?.total || 0,
        todayStockIn: inRes.data?.totalQty || 0,
        todayStockOut: outRes.data?.totalQty || 0,
      };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load dashboard overview";
      return rejectWithValue(msg);
    }
  }
);

// GET low stock list (optionally with threshold)
export const fetchDashboardLowStock = createAsyncThunk(
  "dashboard/fetchLowStock",
  async (threshold, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/dashboard/low-stock-list", {
        params: threshold ? { threshold } : {},
      });

      // backend: { success, count, data }
      return res.data.data || [];
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch low stock list";
      return rejectWithValue(msg);
    }
  }
);

// GET stock summary for chart (days = 7 by default)
export const fetchDashboardStockSummary = createAsyncThunk(
  "dashboard/fetchStockSummary",
  async (days = 7, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/dashboard/stock-summary", {
        params: { days },
      });

      // backend: { success, data: [{ date, stockIn, stockOut }] }
      return res.data.data || [];
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch stock summary";
      return rejectWithValue(msg);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    // overview
    overviewLoading: false,
    overviewError: null,
    totalProducts: 0,
    todayStockIn: 0,
    todayStockOut: 0,

    // low stock list
    lowStockLoading: false,
    lowStockError: null,
    lowStockItems: [],

    // stock summary chart
    summaryLoading: false,
    summaryError: null,
    stockSummary: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // OVERVIEW
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.overviewLoading = true;
        state.overviewError = null;
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.totalProducts = action.payload.totalProducts;
        state.todayStockIn = action.payload.todayStockIn;
        state.todayStockOut = action.payload.todayStockOut;
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.overviewLoading = false;
        state.overviewError = action.payload;
      })

      // LOW STOCK
      .addCase(fetchDashboardLowStock.pending, (state) => {
        state.lowStockLoading = true;
        state.lowStockError = null;
      })
      .addCase(fetchDashboardLowStock.fulfilled, (state, action) => {
        state.lowStockLoading = false;
        state.lowStockItems = action.payload;
      })
      .addCase(fetchDashboardLowStock.rejected, (state, action) => {
        state.lowStockLoading = false;
        state.lowStockError = action.payload;
      })

      // STOCK SUMMARY
      .addCase(fetchDashboardStockSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchDashboardStockSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.stockSummary = action.payload;
      })
      .addCase(fetchDashboardStockSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
