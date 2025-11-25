const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  balance: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
