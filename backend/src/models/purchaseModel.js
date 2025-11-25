const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  invoiceNumber: String,
  date: { type: Date, default: Date.now },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      unitCost: Number,
      totalCost: Number
    }
  ],
  totalAmount: Number,
  amountPaid: Number,
  balanceRemaining: Number,
}, { timestamps: true });

module.exports = mongoose.model("Purchase", PurchaseSchema);
