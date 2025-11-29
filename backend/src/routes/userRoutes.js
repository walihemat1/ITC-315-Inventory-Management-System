import express from "express";
import {
  updateProfile,
  updatePassword,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", authenticateUser, updateProfile);
router.put("/password", authenticateUser, updatePassword);

export default router;
