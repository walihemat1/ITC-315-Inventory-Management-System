import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/create", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.get("/category/:category", getProductsByCategory);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
