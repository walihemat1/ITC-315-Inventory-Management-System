import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/auth/authSlice";
import adminUserReducer from "../pages/admin/adminUserSlice";
import categoryReducer from "../pages/category/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminUsers: adminUserReducer,
    categories: categoryReducer,
  },
});

export default store;
