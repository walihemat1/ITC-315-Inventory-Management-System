const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    imageUrl: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    currentQuantity: {
      type: Number,
      default: 0,
    },
    minimumQuantity: {
      type: Number,
      default: 5,
    },
    lowStock: {
      type: Boolean,
      default: false,
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
