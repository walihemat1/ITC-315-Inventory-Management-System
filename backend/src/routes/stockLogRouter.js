import express from "express";
import {
  getStockInHistory,
  getStockOutHistory,
} from "../controllers/stockLogController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticateUser);

router.get("/in", getStockInHistory);
router.get("/out", getStockOutHistory);

export default router;
