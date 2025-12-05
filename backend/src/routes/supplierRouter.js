import express from "express";
const router = express.Router();
import {
  getSupplier,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

router.get("/", getSuppliers);
router.get("/:id", getSupplier);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

export default router;
