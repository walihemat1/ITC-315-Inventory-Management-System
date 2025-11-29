import StockLog from "../models/stockLogModel");

export const getStockInHistory = async (req, res) => {
  try {
    const logs = await StockLog.find({ type: "PURCHASE" })
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStockOutHistory = async (req, res) => {
  try {
    const logs = await StockLog.find({ type: "SALE" })
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
