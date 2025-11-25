import express from "express";
const router = express.Router();

import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

router.get("/", authenticateUser, getProducts);
router.get("/:id", authenticateUser, getProduct);
router.post("/", authenticateUser, isAdmin, createProduct);
router.put("/:id", authenticateUser, isAdmin, updateProduct);
router.delete("/:id", authenticateUser, isAdmin, deleteProduct);

export default router;
