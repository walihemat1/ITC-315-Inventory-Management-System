import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../app/axiosClient";

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put("/api/user/profile", payload);
      // backend: { success, message, data: updatedUser }
      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update profile";
      return rejectWithValue(msg);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(
        "/api/user/password",
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update password"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    updatingProfile: false,
    updateProfileSuccess: null,
    updateProfileError: null,

    updatingPassword: false,
    updatePasswordSuccess: null,
    updatePasswordError: null,
  },

  reducers: {
    clearUserMessages: (state) => {
      state.updateProfileSuccess = null;
      state.updateProfileError = null;
      state.updatePasswordSuccess = null;
      state.updatePasswordError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // PROFILE UPDATE
      .addCase(updateProfile.pending, (state) => {
        state.updatingProfile = true;
        state.updateProfileError = null;
        state.updateProfileSuccess = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updatingProfile = false;
        state.updateProfileSuccess = "Profile updated successfully";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updatingProfile = false;
        state.updateProfileError = action.payload;
      })

      // PASSWORD UPDATE
      .addCase(updatePassword.pending, (state) => {
        state.updatingPassword = true;
        state.updatePasswordError = null;
        state.updatePasswordSuccess = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.updatingPassword = false;
        state.updatePasswordSuccess = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.updatingPassword = false;
        state.updatePasswordError = action.payload;
      });
  },
});

export const { clearUserMessages } = userSlice.actions;

export default userSlice.reducer;
