import Product from "../models/productModel.js";
import StockLog from "../models/stockLog.js";
import updateLowStock from "../utils/updateLowStock.js";

export const adjustStock = async (req, res) => {
  try {
    const { productId, newQuantity, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const prevQty = product.currentQuantity;

    if (newQuantity < 0)
      return res.status(400).json({ message: "Quantity cannot be negative" });

    product.currentQuantity = newQuantity;
    await updateLowStock(product);

    await StockLog.create({
      productId,
      type: "ADJUSTMENT",
      quantity: newQuantity - prevQty,
      previousStock: prevQty,
      newStock: newQuantity,
      reason,
    });

    res.status(200).json({ message: "Stock adjusted", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
