import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../app/axiosClient";

// GET /api/category
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/category");
      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch categories";
      return rejectWithValue(msg);
    }
  }
);

// POST /api/category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async ({ name, description }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/category", {
        name,
        description,
      });
      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create category";
      return rejectWithValue(msg);
    }
  }
);

// PATCH /api/category/:id
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, name, description }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/api/category/${id}`, {
        name,
        description,
      });
      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update category";
      return rejectWithValue(msg);
    }
  }
);

// DELETE /api/category/:id
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/api/category/${id}`);
      return id;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to delete category";
      return rejectWithValue(msg);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
    saving: false,
    deleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createCategory.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateCategory.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        state.items = state.items.map((c) =>
          c._id === updated._id ? updated : c
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteCategory.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleting = false;
        const deletedId = action.payload;
        state.items = state.items.filter((c) => c._id !== deletedId);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
