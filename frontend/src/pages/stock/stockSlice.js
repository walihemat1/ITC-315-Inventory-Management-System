// src/features/stock/stockSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../app/axiosClient"; // adjust path if your axiosClient is elsewhere

// POST /api/stock-adjustment
export const adjustStock = createAsyncThunk(
  "stock/adjustStock",
  async ({ productId, newQuantity, reason }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/stock-adjustment", {
        productId,
        newQuantity,
        reason,
      });

      return res.data; // { message, product }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to adjust stock";
      return rejectWithValue(msg);
    }
  }
);

// GET /api/products/low-stock?threshold=...
export const fetchLowStock = createAsyncThunk(
  "stock/fetchLowStock",
  async (threshold, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/products/low-stock", {
        params: threshold ? { threshold } : {},
      });

      // backend returns { success, count, data }
      return res.data.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch low stock items";
      return rejectWithValue(msg);
    }
  }
);

// GET /api/stock-history/in
export const fetchStockInHistory = createAsyncThunk(
  "stock/fetchStockInHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/stock-history/in");
      return res.data; // array of logs
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch stock-in history";
      return rejectWithValue(msg);
    }
  }
);

// GET /api/stock-history/out
export const fetchStockOutHistory = createAsyncThunk(
  "stock/fetchStockOutHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/stock-history/out");
      return res.data; // array of logs
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch stock-out history";
      return rejectWithValue(msg);
    }
  }
);

const stockSlice = createSlice({
  name: "stock",
  initialState: {
    // adjust
    adjusting: false,
    adjustError: null,
    lastAdjustedProduct: null,

    // low stock
    lowStockItems: [],
    lowStockLoading: false,
    lowStockError: null,

    // history
    stockIn: [],
    stockOut: [],
    historyLoading: false,
    historyError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ADJUST STOCK
      .addCase(adjustStock.pending, (state) => {
        state.adjusting = true;
        state.adjustError = null;
      })
      .addCase(adjustStock.fulfilled, (state, action) => {
        state.adjusting = false;
        state.lastAdjustedProduct = action.payload.product;
      })
      .addCase(adjustStock.rejected, (state, action) => {
        state.adjusting = false;
        state.adjustError = action.payload;
      })

      // LOW STOCK
      .addCase(fetchLowStock.pending, (state) => {
        state.lowStockLoading = true;
        state.lowStockError = null;
      })
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.lowStockLoading = false;
        state.lowStockItems = action.payload;
      })
      .addCase(fetchLowStock.rejected, (state, action) => {
        state.lowStockLoading = false;
        state.lowStockError = action.payload;
      })

      // STOCK IN
      .addCase(fetchStockInHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchStockInHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.stockIn = action.payload;
      })
      .addCase(fetchStockInHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      })

      // STOCK OUT
      .addCase(fetchStockOutHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchStockOutHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.stockOut = action.payload;
      })
      .addCase(fetchStockOutHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      });
  },
});

export default stockSlice.reducer;
