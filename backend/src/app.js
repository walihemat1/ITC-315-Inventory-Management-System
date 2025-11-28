import express from "express";
import env from "dotenv";
import mongoose from "mongoose";

import productRoute from "./routes/productRoutes.js";
import saleRoute from "./routes/salesRoutes.js";
import purchaseroutes from "./routes/purchaseRoutes.js";
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";
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
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/sales", saleRoute);
app.use("/api/purchases", purchaseroutes);

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
