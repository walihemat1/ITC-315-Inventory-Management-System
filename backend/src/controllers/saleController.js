import Sale from "../models/saleModel.js"
import Product from "../models/productModel.js"
import StockLog from "../models/stockLog.js"
import updateLowStock from "../utils/updateLowStock.js"

export const createSale = async (req, res) => {
  try {
    const { customerId, invoiceNumber, items, tax, discount, amountPaid, paymentMethod } = req.body;

    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      if (product.currentQuantity < item.quantity) {
        return res.status(400).json({success: false, message: "Not enough stock" });
      }

      const prevQty = product.currentQuantity;
      const newQty = prevQty - item.quantity;

      product.currentQuantity = newQty;
      await updateLowStock(product);

      await StockLog.create({
        productId: product._id,
        type: "SALE",
        quantity: item.quantity,
        previousStock: prevQty,
        newStock: newQty,
      });

      item.total = item.quantity * item.price;
      subtotal += item.total;
    }

    const totalAmount = subtotal + tax - discount;

    const sale = await Sale.create({
      customerId,
      invoiceNumber,
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      amountPaid,
      paymentMethod,
    });

    res.status(201).json(sale);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
