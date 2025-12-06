import express from "express";

const router = express.Router();
import {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

router.get("/", authenticateUser, getCategories);
router.put("/:id", authenticateUser, getCategory);
router.post("/", authenticateUser, createCategory);
router.patch("/:id", authenticateUser, updateCategory);
router.delete("/:id", authenticateUser, deleteCategory);

export default router;
