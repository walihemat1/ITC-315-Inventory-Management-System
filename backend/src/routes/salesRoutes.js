import express from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
} from "../controllers/salesController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authenticateUser, createSale);
router.get("/", authenticateUser, getAllSales);
router.get("/:id", authenticateUser, getSaleById);
router.put("/:id", authenticateUser, updateSale);
router.delete("/:id", authenticateUser, deleteSale);

export default router;
