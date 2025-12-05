import express from "express";

import {
  getSettings,
  updateSettings,
  createSetting,
} from "../controllers/settingsController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// create setting
router.post("/", authenticateUser, isAdmin, createSetting);

// GET /settings
router.get("/", authenticateUser, getSettings);

// PATCH /settings
router.patch("/", authenticateUser, isAdmin, updateSettings);

export default router;
