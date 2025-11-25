const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "cashier", "manager"], default: "cashier" },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
