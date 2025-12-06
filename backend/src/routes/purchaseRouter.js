import express from "express";
import {
  createPurchase,
  deletePurchases,
  getPurchases,
  updatePurchases,
} from "../controllers/purchaseController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", createPurchase);
router.get("/", getPurchases);
router.put("/:id", updatePurchases);
router.delete("/:id", deletePurchases);
router.post("/", authenticateUser, createPurchase);

export default router;
