import express from "express";
import {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase
} from "../controllers/purchaseController.js";

const router = express.Router();

router.post("/", createPurchase);
router.get("/", getAllPurchases);
router.get("/:id", getPurchaseById);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

export default router;
