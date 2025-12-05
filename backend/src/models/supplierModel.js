import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: String,
    address: String,
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", SupplierSchema);
