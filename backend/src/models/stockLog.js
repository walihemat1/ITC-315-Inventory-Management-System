import mongoose from "mongoose";

const StockLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  type: { type: String, enum: ["PURCHASE", "SALE", "ADJUSTMENT"] },
  quantity: Number,
  previousStock: Number,
  newStock: Number,
  referenceId: mongoose.Schema.Types.ObjectId, 
}, { timestamps: true });

export default mongoose.model("StockLog", StockLogSchema);
