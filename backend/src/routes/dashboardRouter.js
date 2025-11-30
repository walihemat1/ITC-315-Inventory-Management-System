import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getTotalProducts,
  getTodayStockIn,
  getTodayStockOut,
  getLowStockList,
  getStockSummary,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/total-products", getTotalProducts);
router.get("/today-stock-in", getTodayStockIn);
router.get("/today-stock-out", getTodayStockOut);
router.get("/low-stock-list", getLowStockList);
router.get("/stock-summary", getStockSummary);

export default router;
