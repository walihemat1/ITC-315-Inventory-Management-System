import Purchase from "../models/purchaseModel.js";
import Product from "../models/productModel.js";

// Create a new purchase
export const createPurchase = async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    const savedPurchase = await purchase.save();
    //Update product stock based on purchase items
    for (const item of savedPurchase.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { currentQuantity: item.quantity } } // increase product stock

      );
    }
    res.status(201).json({ success: true, data: savedPurchase });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all purchases
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplierId")
      .populate("userId")
      .populate("items.productId");

    res.json({ success: true, data: purchases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single purchase by ID
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplierId")
      .populate("userId")
      .populate("items.productId");

    if (!purchase) {
      return res.status(404).json({ success: false, message: "Purchase not found" });
    }

    res.json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update purchase
export const updatePurchase = async (req, res) => {
  try {
    const oldPurchase = await Purchase.findById(req.params.id);

    if (!oldPurchase) {
      return res.status(404).json({ success: false, message: "Purchase not found" });
    }

    // Reverse old stock
    for (let item of oldPurchase.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { currentQuantity: -item.quantity } }
      );
    }

    // Apply new update
    const updated = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Add new stock
    for (let item of updated.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { currentQuantity: item.quantity } }
      );
    }

    res.json({ success: true, data: updated });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


// Delete purchase
export const deletePurchase = async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Purchase not found" });
    }
    for (let item of deleted.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { currentQuantity: -item.quantity } }  // subtract stock
      );
    }


    res.json({ success: true, message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
