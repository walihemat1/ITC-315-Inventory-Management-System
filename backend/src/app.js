import express from "express";
import env from "dotenv";
import mongoose from "mongoose";

import productRoute from "./routes/productRoutes.js";
import categoryRoute from "./routes/categoryRouter.js";
import saleRoute from "./routes/salesRoutes.js";
import purchaseRoute from "./routes/purchaseRouter.js";
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";
import adminUserRoute from "./routes/adminUserRouter.js";
import adjustmentRoute from "./routes/adjustmentRouter.js";
import settingRoute from "./routes/settingRouter.js";
import stockLogRoute from "./routes/stockLogRouter.js";
import supplierRoute from "./routes/supplierRouter.js";
import dashboardRoute from "./routes/dashboardRouter.js";
import reportRoute from "./routes/reportRouter.js";
import connectDB from "./config/db.js";

env.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded());

connectDB();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin/user", adminUserRoute);
app.use("/api/stock-adjustment", adjustmentRoute);
app.use("/api/category", categoryRoute);
app.use("/api/sale", saleRoute);
app.use("/api/category", categoryRoute);
app.use("/api/setting", settingRoute);
app.use("/api/stock-history", stockLogRoute);
app.use("/api/supplier", supplierRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/report", reportRoute);

app.use("/uploads/productImages", express.static("uploads/productImages"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("DB connected successfully");
      console.log(`App is listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Connection Error: ", err);
    process.exit(1);
  });
