import Sale from "../models/saleModel.js";
import Product from "../models/productModel.js";
import Customer from "../models/customerModel.js";
import StockLog from "../models/stockLog.js";

export const createSale = async (req, res) => {
  try {
    const { sellerId, customerId, items, totalAmount, amountPaid } = req.body;

    if (
      !sellerId ||
      !customerId ||
      !items ||
      items.length === 0 ||
      totalAmount == null ||
      amountPaid == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1) Validate stock + prepare product data
    const productDocs = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      if (product.currentQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product ${product.name}`,
        });
      }

      productDocs.push(product);
    }

    // 2) Calculate item totals & subtotal
    let subtotal = 0;
    items.forEach((item, idx) => {
      const price = Number(item.price ?? 0);
      item.total = item.quantity * price;
      subtotal += item.total;
    });

    // if you want totalAmount to be driven by subtotal you can recompute here,
    // but I'll trust the payload since you're already sending totalAmount.

    // 3) Create the sale
    const sale = await Sale.create({
      sellerId,
      customerId,
      items,
      subtotal,
      totalAmount,
      amountPaid,
      paymentMethod: req.body.paymentMethod,
      invoiceNumber: req.body.invoiceNumber,
      tax: req.body.tax ?? 0,
      discount: req.body.discount ?? 0,
      notes: req.body.notes ?? "",
    });

    // 4) Deduct stock & create stock-out logs
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = productDocs[i];

      const prevQty = product.currentQuantity;
      const newQty = prevQty - item.quantity;

      product.currentQuantity = newQty;
      await product.save();

      await StockLog.create({
        productId: product._id,
        type: "SALE",
        quantity: item.quantity,
        previousStock: prevQty,
        newStock: newQty,
        referenceId: sale._id,
      });
    }

    // 5) Update customer balance if needed
    if (amountPaid < totalAmount) {
      const balanceToAdd = totalAmount - amountPaid;

      await Customer.findByIdAndUpdate(customerId, {
        $inc: { balance: balanceToAdd },
      });
    }

    return res.status(201).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error("createSale error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a sale
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Sale ID is required",
      });
    }

    // 1) Get old sale
    const oldSale = await Sale.findById(id);
    if (!oldSale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    // 2) Restore stock from old sale
    for (const item of oldSale.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { currentQuantity: item.quantity },
      });
    }

    // 3) Apply new data
    const updatedSale = await Sale.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // 4) Subtract stock for new items
    for (const item of updatedSale.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { currentQuantity: -item.quantity },
      });
    }

    // 5) Adjust customer balance
    const customer = await Customer.findById(updatedSale.customerId);
    if (customer) {
      const oldBalanceIncrease = Math.max(
        oldSale.totalAmount - oldSale.amountPaid,
        0
      );
      const newBalanceIncrease = Math.max(
        updatedSale.totalAmount - updatedSale.amountPaid,
        0
      );

      customer.balance =
        (customer.balance || 0) - oldBalanceIncrease + newBalanceIncrease;

      if (customer.balance < 0) customer.balance = 0;

      await customer.save();
    }

    return res.json({ success: true, data: updatedSale });
  } catch (error) {
    console.error("updateSale error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customerId", "name phone address")
      .populate("sellerId", "fullName")
      .populate("editedBy", "fullName")
      .populate("items.productId", "name sku");

    res.json(sales);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single sale by ID
export const getSaleById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Sale ID is required",
    });
  }
  try {
    const sale = await Sale.findById(id)
      .populate("customerId")
      .populate("sellerId")
      .populate("items.productId");

    if (!sale) {
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a sale
export const deleteSale = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Sale ID is required",
    });
  }

  try {
    // Step 1: Find sale
    const deletedSale = await Sale.findByIdAndDelete(id);

    if (!deletedSale) {
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    // Step 2: Restore stock
    if (deletedSale.items && deletedSale.items.length > 0) {
      for (const item of deletedSale.items) {
        // FIXED: deleteSale.items → deletedSale.items
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { currentQuantity: item.quantity },
        });
      }
    }

    // Step 3: Update customer balance
    const balanceIncrease = Math.max(
      deletedSale.totalAmount - deletedSale.amountPaid,
      0
    );

    const customer = await Customer.findById(deletedSale.customerId);
    if (customer) {
      customer.balance = (customer.balance || 0) - balanceIncrease;
      if (customer.balance < 0) customer.balance = 0; // Prevent negative balance
      await customer.save();
    }

    res.json({ success: true, message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};
