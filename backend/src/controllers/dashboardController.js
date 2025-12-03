import Product from "../models/productModel.js";
import StockLog from "../models/stockLog.js";

/**
 * GET /api/dashboard/total-products
 */
export const getTotalProducts = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    res.status(200).json({ success: true, total });
  } catch (error) {
    console.error("getTotalProducts:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Helper: start and end of today (UTC)
 */
const todayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

/**
 * GET /api/dashboard/today-stock-in
 * returns total quantity (or total value if required)
 */
export const getTodayStockIn = async (req, res) => {
  try {
    const { start, end } = todayRange();
    const pipeline = [
      { $match: { type: "PURCHASE", createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ];
    const agg = await StockLog.aggregate(pipeline);
    const totalQty = agg[0]?.totalQty || 0;
    res.status(200).json({ success: true, totalQty });
  } catch (error) {
    console.error("getTodayStockIn:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/dashboard/today-stock-out
 */
export const getTodayStockOut = async (req, res) => {
  try {
    const { start, end } = todayRange();
    const pipeline = [
      { $match: { type: "SALE", createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ];
    const agg = await StockLog.aggregate(pipeline);
    const totalQty = agg[0]?.totalQty || 0;
    res.status(200).json({ success: true, totalQty });
  } catch (error) {
    console.error("getTodayStockOut:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/dashboard/low-stock-list?threshold=10
 * Delegates to product query for listing; optionally use StockLog or Product
 */
export const getLowStockList = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || null;
    const query = threshold
      ? { currentQuantity: { $lt: threshold } }
      : { $expr: { $lt: ["$currentQuantity", "$minimumQuantity"] } };
    const items = await Product.find(query)
      .select("name sku currentQuantity minimumQuantity")
      .sort({ currentQuantity: 1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("getLowStockList error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/dashboard/stock-summary?days=7
 * returns arrays for charting: [{date, stockIn, stockOut}]
 */
export const getStockSummary = async (req, res) => {
  try {
    const days = Number(req.query.days) || 7;
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    // group by day and type
    const pipeline = [
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$type",
          },
          totalQty: { $sum: "$quantity" },
        },
      },
      {
        $group: {
          _id: "$_id.day",
          entries: {
            $push: {
              type: "$_id.type",
              totalQty: "$totalQty",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const agg = await StockLog.aggregate(pipeline);

    // build full days array
    const resultMap = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      resultMap[key] = { date: key, stockIn: 0, stockOut: 0 };
    }

    for (const r of agg) {
      const day = r._id;
      for (const e of r.entries) {
        if (e.type === "PURCHASE") resultMap[day].stockIn = e.totalQty;
        if (e.type === "SALE") resultMap[day].stockOut = e.totalQty;
      }
    }

    const results = Object.values(resultMap);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("getStockSummary error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
