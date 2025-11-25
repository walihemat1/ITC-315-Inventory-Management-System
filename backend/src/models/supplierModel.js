const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  address: String,
  balance: { type: Number, default: 0 }, 
}, { timestamps: true });

module.exports = mongoose.model("Supplier", SupplierSchema);
