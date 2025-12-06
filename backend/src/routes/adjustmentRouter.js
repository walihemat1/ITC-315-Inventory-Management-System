import express from "express";
import { adjustStock } from "../controllers/adjustmentController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, adjustStock);

export default router;
