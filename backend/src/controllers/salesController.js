import Sale from "../models/saleModel.js";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Customer from "../models/customerModel.js";

// Create a new sale
export const createSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sellerId, customerId, items, totalAmount, amountPaid } = req.body;

    if (!sellerId || !customerId || !items || items.length === 0 || !totalAmount || !amountPaid) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // STEP 1: Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (product.currentQuantity < item.quantity) {
        throw new Error(`Not enough stock for product ${product.name}`);
      }
    }

    // STEP 2: Create the sale
    const sale = new Sale(req.body);
    const savedSale = await sale.save({ session });

    // STEP 3: Deduct stock
    for (const item of savedSale.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { currentQuantity: -item.quantity } },
        { session }
      );
    }

    // STEP 4: Update customer balance if needed
    if (amountPaid < totalAmount) {
      const balanceToAdd = totalAmount - amountPaid;

      await Customer.findByIdAndUpdate(
        customerId,
        { $inc: { balance: balanceToAdd } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: savedSale
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customerId", "name phone address")
      .populate("sellerId", "name email")
      .populate("items.productId", "name sku");

    res.json(sales);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single sale by ID
export const getSaleById = async (req, res) => {
  const { id } = req.params;
  if (!id){
    return res.status(400).json({
      success: false,
      message: "Sale ID is required" });
  }
  try {
    const sale = await Sale.findById(id)
      .populate("customerId")
      .populate("sellerId")
      .populate("items.productId");

    if (!sale) {
      return res.status(404).json({ success: false, message: "Sale not found" });
    }

    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a sale
export const updateSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Sale ID is required"
      });
    }

    // Get old sale
    const oldSale = await Sale.findById(id).session(session);
    if (!oldSale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found"
      });
    }

    // Step 1: Restore stock from old sale
    for (const item of oldSale.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { currentQuantity: item.quantity } },
        { session }
      );
    }

    // Step 2: Update sale
    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      req.body,
      { new: true, session }
    );

    // Step 3: Subtract new stock
    for (const item of updatedSale.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { currentQuantity: -item.quantity } },
        { session }
      );
    }

    // Step 4: Update customer balance
    const customer = await Customer.findById(updatedSale.customerId).session(session);
    if (customer) {
      const oldBalanceIncrease = Math.max(oldSale.totalAmount - oldSale.amountPaid, 0);
      const newBalanceIncrease = Math.max(updatedSale.totalAmount - updatedSale.amountPaid, 0);

      customer.balance = (customer.balance || 0) - oldBalanceIncrease + newBalanceIncrease;
      await customer.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, data: updatedSale });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a sale
export const deleteSale = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Sale ID is required"
    });
  }

  try {
    // Step 1: Find sale
    const deletedSale = await Sale.findByIdAndDelete(id);

    if (!deletedSale) {
      return res.status(404).json({ success: false, message: "Sale not found" });
    }

    // Step 2: Restore stock
    if (deletedSale.items && deletedSale.items.length > 0) {
      for (const item of deletedSale.items) {   // FIXED: deleteSale.items → deletedSale.items
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { currentQuantity: item.quantity } }
        );
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
  deleteSale
};