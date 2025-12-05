import StockLog from "../models/stockLog.js";
import Product from "../models/productModel.js";
import PDFDocument from "pdfkit";

/**
 * GET /api/reports/movements?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
export const getMovementReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = start ? new Date(start) : new Date(0);
    const endDate = end ? new Date(end) : new Date();

    // include end full day
    endDate.setHours(23, 59, 59, 999);

    const logs = await StockLog.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate("productId", "name sku")
      .sort({ createdAt: -1 });

    // map included fields
    const data = logs.map((l) => ({
      id: l._id,
      date: l.createdAt,
      type: l.type,
      product: l.productId?.name || "Unknown",
      sku: l.productId?.sku || null,
      quantity: l.quantity,
      previousStock: l.previousStock,
      newStock: l.newStock,
      referenceId: l.referenceId || null,
      reason: l.reason || null,
    }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error("getMovementReport:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/reports/low-stock
 */
export const getLowStockReport = async (req, res) => {
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
    console.error("getLowStockReport:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/reports/movements/pdf?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
export const downloadMovementReportPdf = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = start ? new Date(start) : new Date(0);
    const endDate = end ? new Date(end) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const logs = await StockLog.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate("productId", "name sku")
      .sort({ createdAt: -1 });

    // stream PDF
    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="movement-report-${Date.now()}.pdf"`
    );

    doc.pipe(res);

    doc.fontSize(18).text("Stock Movement Report", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .text(`From: ${startDate.toDateString()}  To: ${endDate.toDateString()}`);
    doc.moveDown();

    // header
    doc.fontSize(10).text("Date", { continued: true, width: 80 });
    doc.text("Type", { continued: true, width: 60 });
    doc.text("Product", { continued: true, width: 150 });
    doc.text("Qty", { continued: true, width: 40 });
    doc.text("Prev", { continued: true, width: 40 });
    doc.text("New", { continued: true, width: 40 });
    doc.moveDown(0.2);
    doc
      .moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();
    doc.moveDown(0.2);

    for (const l of logs) {
      const dateStr = new Date(l.createdAt).toLocaleString();
      const productName = l.productId?.name || "Unknown";
      doc
        .fontSize(9)
        .text(dateStr, { continued: true, width: 120 })
        .text(l.type, { continued: true, width: 60 })
        .text(productName, { continued: true, width: 160 })
        .text(String(l.quantity), { continued: true, width: 40 })
        .text(String(l.previousStock ?? ""), { continued: true, width: 40 })
        .text(String(l.newStock ?? ""), { width: 40 });
    }

    doc.end();
  } catch (error) {
    console.error("downloadMovementReportPdf error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/reports/low-stock/pdf?threshold=10
 */
export const downloadLowStockPdf = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || null;
    const query = threshold
      ? { currentQuantity: { $lt: threshold } }
      : { $expr: { $lt: ["$currentQuantity", "$minimumQuantity"] } };
    const items = await Product.find(query)
      .select("name sku currentQuantity minimumQuantity")
      .sort({ currentQuantity: 1 });

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="low-stock-report-${Date.now()}.pdf"`
    );
    doc.pipe(res);

    doc.fontSize(18).text("Low Stock Report", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Threshold: ${threshold ?? "product.minimumQuantity"}`);
    doc.moveDown();

    // table header
    doc
      .fontSize(11)
      .text("Product", { continued: true, width: 220 })
      .text("SKU", { continued: true, width: 80 })
      .text("Qty", { continued: true, width: 60 })
      .text("Min", { width: 60 });

    doc.moveDown(0.3);
    for (const p of items) {
      doc
        .fontSize(10)
        .text(p.name, { continued: true, width: 220 })
        .text(p.sku || "", { continued: true, width: 80 })
        .text(String(p.currentQuantity), { continued: true, width: 60 })
        .text(String(p.minimumQuantity || ""), { width: 60 });
    }

    doc.end();
  } catch (error) {
    console.error("downloadLowStockPdf error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
