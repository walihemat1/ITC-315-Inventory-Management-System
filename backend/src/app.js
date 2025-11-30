import express from "express";
import env from "dotenv";
import mongoose from "mongoose";

import productRoute from "./routes/productRoutes.js";
import saleRoute from "./routes/salesRoutes.js";
import purchaseroutes from "./routes/purchaseRoutes.js";
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";
import adjustmentRoute from "./routes/adjustmentRouter.js";
import categoryRoute from "./routes/categoryRouter.js";
import saleRoute from "./routes/saleRouter.js";
import settingRoute from "./routes/settingRouer.js";
import stockLogRoute from "./routes/stockLogRouter.js";
import supplierRouter from "./routes/supplierRouter.js";

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
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/stock-adjustment", adjustmentRoute);
app.use("/api/category", categoryRoute);
app.use("/api/sale", saleRoute);
app.use("/api/category", categoryRoute);
app.use("/api/setting", settingRoute);
app.use("/api/stock-history", stockLogRoute);
app.use("/api/supplier", supplierRouter);

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
