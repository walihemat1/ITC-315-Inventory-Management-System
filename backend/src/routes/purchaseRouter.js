import express from "express";
import { createPurchase } from "../controllers/purchaseController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, createPurchase);

export default router;
