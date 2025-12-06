import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  invoiceNumber: String,
  date: { type: Date, default: Date.now },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  subtotal: Number,
  tax: Number,
  discount: Number,
  totalAmount: Number,
  amountPaid: Number,
  notes: String,
  paymentMethod: { type: String, enum: ["cash", "card", "mobile"] },
}, { timestamps: true });

export default mongoose.model("Sale", SaleSchema);
