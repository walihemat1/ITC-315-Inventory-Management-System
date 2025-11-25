const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  shopName: String,
  address: String,
  currency: { type: String, default: "USD" },
  taxRate: { type: Number, default: 0 },
  logoUrl: String,
}, { timestamps: true });

module.exports = mongoose.model("Setting", SettingSchema);
