import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import {
  getMovementReport,
  getLowStockReport,
  downloadMovementReportPdf,
  downloadLowStockPdf,
} from "../controllers/reportController.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/movements", getMovementReport);
router.get("/low-stock", getLowStockReport);

router.get("/movements/pdf", isAdmin, downloadMovementReportPdf);
router.get("/low-stock/pdf", isAdmin, downloadLowStockPdf);

export default router;
