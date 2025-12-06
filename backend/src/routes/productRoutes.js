import express from "express";
const router = express.Router();
import upload from "../middleware/upload.js";

import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getLowStockItems,
} from "../controllers/productController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

router.get("/", authenticateUser, getProducts);
router.get("/low-stock", authenticateUser, getLowStockItems);
router.get("/category/:category", authenticateUser, getProductsByCategory);
router.get("/:id", authenticateUser, getProduct);

router.post("/create", upload.single("image"), authenticateUser, createProduct);
router.put("/:id", upload.single("image"), authenticateUser, updateProduct);
router.delete("/:id", authenticateUser, isAdmin, deleteProduct);

export default router;
