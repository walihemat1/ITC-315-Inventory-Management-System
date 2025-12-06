import express from "express";
import {
  createPurchase,
  deletePurchases,
  getPurchases,
  updatePurchases,
} from "../controllers/purchaseController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authenticateUser, createPurchase);
router.get("/", authenticateUser, getPurchases);
router.put("/:id", authenticateUser, updatePurchases);
router.delete("/:id", authenticateUser, deletePurchases);
router.post("/", authenticateUser, createPurchase);

export default router;
