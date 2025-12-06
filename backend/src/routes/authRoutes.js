import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
