import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    invoiceNumber: String,
    date: { type: Date, default: Date.now },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        unitCost: Number,
        totalCost: Number,
      },
    ],
    totalAmount: Number,
    amountPaid: Number,
    balanceRemaining: Number,
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", PurchaseSchema);
export default Purchase;
