import express from "express";
import env from "dotenv";
import mongoose from "mongoose";

import productRoute from "./routes/productRoutes.js";

env.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/products", productRoute);

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
