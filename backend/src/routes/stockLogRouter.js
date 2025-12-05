import express from "express";
import {
  getStockInHistory,
  getStockOutHistory,
} from "../controllers/stockLogController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/in", getStockInHistory);
router.get("/out", getStockOutHistory);

export default router;
