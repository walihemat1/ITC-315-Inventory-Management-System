// src/features/adminUsers/adminUsersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../app/axiosClient";

// GET /api/admin/user
export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetchAdminUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/admin/user");
      if (!res.data.success) {
        return rejectWithValue(res.data.message || "Failed to fetch users");
      }
      return res.data.data; // array of users
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch users";
      return rejectWithValue(msg);
    }
  }
);

// POST /api/admin/user
export const createAdminUser = createAsyncThunk(
  "adminUsers/createAdminUser",
  async ({ fullName, email, password, role }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/admin/user", {
        fullName,
        email,
        password,
        role,
      });

      if (!res.data.success) {
        return rejectWithValue(res.data.message || "Failed to create user");
      }

      return res.data.data; // created user
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create user";
      return rejectWithValue(msg);
    }
  }
);

// PATCH /api/admin/user/:id/role
export const updateAdminUserRole = createAsyncThunk(
  "adminUsers/updateAdminUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/api/admin/user/${id}/role`, {
        role,
      });

      if (!res.data.success) {
        return rejectWithValue(res.data.message || "Failed to update role");
      }

      return res.data.data; // updated user
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update role";
      return rejectWithValue(msg);
    }
  }
);

// PATCH /api/admin/user/:id/status
export const updateAdminUserStatus = createAsyncThunk(
  "adminUsers/updateAdminUserStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/api/admin/user/${id}/status`, {
        isActive,
      });

      if (!res.data.success) {
        return rejectWithValue(res.data.message || "Failed to update status");
      }

      return res.data.data; // updated user
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update status";
      return rejectWithValue(msg);
    }
  }
);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
    creating: false,
    updating: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createAdminUser.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.creating = false;
        state.users.unshift(action.payload);
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // update role
      .addCase(updateAdminUserRole.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAdminUserRole.fulfilled, (state, action) => {
        state.updating = false;
        const updatedUser = action.payload;
        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u
        );
      })
      .addCase(updateAdminUserRole.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // update status
      .addCase(updateAdminUserStatus.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAdminUserStatus.fulfilled, (state, action) => {
        state.updating = false;
        const updatedUser = action.payload;
        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u
        );
      })
      .addCase(updateAdminUserStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export default adminUsersSlice.reducer;
