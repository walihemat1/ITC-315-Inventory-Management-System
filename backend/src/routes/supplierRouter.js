import express from "express";
const router = express.Router();
import {
  getSupplier,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

router.get("/", authenticateUser, getSuppliers);
router.get("/:id", authenticateUser, getSupplier);
router.post("/", authenticateUser, createSupplier);
router.put("/:id", authenticateUser, updateSupplier);
router.delete("/:id", authenticateUser, deleteSupplier);

export default router;
