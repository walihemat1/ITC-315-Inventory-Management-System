import Product from "../models/productModel.js";

/**
 * GET /api/products/low-stock?threshold=10
 * If threshold not provided uses product.minimumQuantity OR query param.
 */
export const getLowStockItems = async (req, res) => {
  try {
    const qThreshold = Number(req.query.threshold);
    let products;

    if (!Number.isFinite(qThreshold) || qThreshold <= 0) {
      // use each product minimumQuantity flag
      products = await Product.find({
        $expr: { $lt: ["$currentQuantity", "$minimumQuantity"] },
      })
        .select("name sku currentQuantity minimumQuantity")
        .sort({ currentQuantity: 1 });
    } else {
      products = await Product.find({ currentQuantity: { $lt: qThreshold } })
        .select("name sku currentQuantity minimumQuantity")
        .sort({ currentQuantity: 1 });
    }

    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error("getLowStockItems error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
