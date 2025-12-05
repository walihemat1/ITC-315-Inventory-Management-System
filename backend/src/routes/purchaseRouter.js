import express from "express";
import {
  createPurchase,
  getPurchases,
} from "../controllers/purchaseController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", createPurchase);
router.get("/", getPurchases);
router.post("/", authenticateUser, createPurchase);

export default router;
