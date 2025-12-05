// src/features/settings/settingsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../app/axiosClient";

// GET /api/setting
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/setting");
      return res.data; // can be null or the settings object
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch settings";
      return rejectWithValue(msg);
    }
  }
);

// PATCH /api/setting (admin only)
export const saveSettings = createAsyncThunk(
  "settings/saveSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch("/api/setting", payload);
      return res.data; // updated (or created) settings
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to save settings";
      return rejectWithValue(msg);
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    data: null,
    loading: false,
    error: null,
    saving: false,
    saveError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SAVE
      .addCase(saveSettings.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      });
  },
});

export default settingsSlice.reducer;
