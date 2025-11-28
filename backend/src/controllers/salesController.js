import Sale from "../models/saleModel.js";

// Create a new sale
export const createSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    const savedSale = await sale.save();
    res.status(201).json({ success: true, data: savedSale });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customerId")
      .populate("sellerId")
      .populate("items.productId");

    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single sale by ID
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
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
  try {
    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ success: false, message: "Sale not found" });
    }

    res.json({ success: true, data: updatedSale });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a sale
export const deleteSale = async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);

    if (!deletedSale) {
      return res.status(404).json({ success: false, message: "Sale not found" });
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