import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/auth/authSlice";
import adminUserReducer from "../pages/admin/adminUserSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminUsers: adminUserReducer,
  },
});

export default store;
