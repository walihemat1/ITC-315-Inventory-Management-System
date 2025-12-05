import Purchase from "../models/purchaseModel.js";
import Product from "../models/productModel.js";
import StockLog from "../models/stockLog.js";
import updateLowStock from "../utils/updateLowStock.js";

export const createPurchase = async (req, res) => {
  try {
    const { supplierId, invoiceNumber, items, amountPaid } = req.body;

    let totalAmount = 0;

    // Loop through items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const prevQty = product.currentQuantity;
      const newQty = prevQty + item.quantity;

      // Update product stock
      product.currentQuantity = newQty;
      await updateLowStock(product);

      // Create stock log
      await StockLog.create({
        productId: product._id,
        type: "PURCHASE",
        quantity: item.quantity,
        previousStock: prevQty,
        newStock: newQty,
      });

      // total cost per item
      item.totalCost = item.unitCost * item.quantity;
      totalAmount += item.totalCost;
    }

    const balanceRemaining = totalAmount - amountPaid;

    // Save the purchase record
    const purchase = await Purchase.create({
      supplierId,
      invoiceNumber,
      items,
      totalAmount,
      amountPaid,
      balanceRemaining,
    });

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("items.productId", "name");

    if (purchases) {
      res.status(200).json(purchases);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
