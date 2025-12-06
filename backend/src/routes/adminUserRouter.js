import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import {
  createStaff,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../controllers/adminUserController.js";

const router = express.Router();

// All routes protected and admin-only
router.use(authenticateUser, isAdmin);

router.post("/", createStaff);
router.get("/", getUsers);
router.patch("/:id/role", updateUserRole);
router.patch("/:id/status", updateUserStatus);

export default router;
