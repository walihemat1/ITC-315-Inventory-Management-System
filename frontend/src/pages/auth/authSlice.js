import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../app/axiosClient";

const storedAuth = localStorage.getItem("auth");
const initialAuth = storedAuth ? JSON.parse(storedAuth) : null;

const initialState = {
  user: initialAuth?.user || null,
  token: initialAuth?.token || null,
  role: initialAuth?.role || null,
  loading: false,
  error: null,
};

// ---------- LOGIN ----------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/auth/login", {
        email,
        password,
      });

      const data = res.data;

      if (!data.success) {
        return rejectWithValue(data.message || "Login failed");
      }

      // Backend returns:
      // data: { email, username, id }, token
      const user = {
        id: data.data.id,
        email: data.data.email,
        fullName: data.data.fullName,
        role: data.data.role,
      };

      const token = data.token;

      const authToStore = {
        user,
        token,
        role: user.role || null,
      };

      localStorage.setItem("auth", JSON.stringify(authToStore));

      return authToStore;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed";
      return rejectWithValue(msg);
    }
  }
);

// ---------- LOGOUT ----------
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/auth/logout");

      const data = res.data;

      if (!data.success) {
        return rejectWithValue(data.message || "Logout failed");
      }

      localStorage.removeItem("auth");
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Logout failed";
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("auth");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.role = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
