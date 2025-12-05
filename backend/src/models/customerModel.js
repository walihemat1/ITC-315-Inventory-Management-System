import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    address: String,
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", CustomerSchema);
