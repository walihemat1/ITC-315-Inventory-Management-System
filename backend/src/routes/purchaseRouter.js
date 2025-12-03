import express from "express";
import { createPurchase } from "../controllers/purchaseController.js";

const router = express.Router();

router.post("/", createPurchase);

export default router;
