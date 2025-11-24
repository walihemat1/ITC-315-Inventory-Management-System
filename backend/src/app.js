const express = require("express");
const Product = require("./models.productModel.js");
const mongoose = require("mongoose");
const productRoute = require ("./routes/productRoutes.js");
const app = express();

//routes
app.use('/api/products', productRoute);