import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/auth/authSlice";
import adminUserReducer from "../pages/admin/adminUserSlice";
import categoryReducer from "../pages/category/categorySlice";
import stockReducer from "../pages/stock/stockSlice";
import settingReducer from "../pages/setting/settingSlice";
import reportsReducer from "../pages/report/reportsSlice";
import dashboardReducer from "../pages/dashboard/dashboardSlice";
import userReducer from "../pages/user/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminUsers: adminUserReducer,
    categories: categoryReducer,
    stock: stockReducer,
    settings: settingReducer,
    reports: reportsReducer,
    dashboard: dashboardReducer,
    user: userReducer,
  },
});

export default store;
