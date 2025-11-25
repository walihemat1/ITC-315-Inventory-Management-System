import express from "express";
import {
  updateProfile,
  updatePassword,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.update("/profile", authenticateUser, updateProfile);
router.update("/password", authenticateUser, updatePassword);

export default router;
