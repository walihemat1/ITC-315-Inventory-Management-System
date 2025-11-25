const express = require("express");
const Product = require("./models/productModel.js");
const dotenv = require("dotenv")
const productRoute = require ("./routes/productRoutes.js");
const categoryRoute = require("./routes/categoryRouter.js");
const supplierRoute = require("./routes/supplierRouter.js");
const connectDB = require("./config/db")

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded());

connectDB();

//routes
app.use('/api/products', productRoute);
app.use('/api/category', categoryRoute);
app.use('/api/supplier', supplierRoute);

// Simple route
app.get("/", (req, res) => {
  res.send("Inventory Management API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));