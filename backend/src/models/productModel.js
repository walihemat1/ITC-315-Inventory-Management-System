const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  purchasePrice: Number,
  sellingPrice: Number,
  stock: { type: Number, default: 0 },
  unit: String,
  lowStockAlert: { type: Number, default: 5 },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
