import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../app/axiosClient";

// GET /api/report/movements?start=YYYY-MM-DD&end=YYYY-MM-DD
export const fetchMovementReport = createAsyncThunk(
  "reports/fetchMovementReport",
  async ({ start, end } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/report/movements", {
        params: { start, end },
      });

      // backend: { success, count, data }
      return res.data.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch movement report";
      return rejectWithValue(msg);
    }
  }
);

// GET /api/report/low-stock?threshold=10
export const fetchLowStockReport = createAsyncThunk(
  "reports/fetchLowStockReport",
  async ({ threshold } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/report/low-stock", {
        params: threshold ? { threshold } : {},
      });

      // backend: { success, count, data }
      return res.data.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch low stock report";
      return rejectWithValue(msg);
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    // movement
    movements: [],
    movementLoading: false,
    movementError: null,

    // low stock
    lowStock: [],
    lowStockLoading: false,
    lowStockError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // MOVEMENTS
      .addCase(fetchMovementReport.pending, (state) => {
        state.movementLoading = true;
        state.movementError = null;
      })
      .addCase(fetchMovementReport.fulfilled, (state, action) => {
        state.movementLoading = false;
        state.movements = action.payload;
      })
      .addCase(fetchMovementReport.rejected, (state, action) => {
        state.movementLoading = false;
        state.movementError = action.payload;
      })

      // LOW STOCK REPORT
      .addCase(fetchLowStockReport.pending, (state) => {
        state.lowStockLoading = true;
        state.lowStockError = null;
      })
      .addCase(fetchLowStockReport.fulfilled, (state, action) => {
        state.lowStockLoading = false;
        state.lowStock = action.payload;
      })
      .addCase(fetchLowStockReport.rejected, (state, action) => {
        state.lowStockLoading = false;
        state.lowStockError = action.payload;
      });
  },
});

export default reportsSlice.reducer;
