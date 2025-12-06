import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  updateCustomerBalance,
} from "../controllers/customerController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, createCustomer);
router.get("/", authenticateUser, getCustomers);
router.get("/:id", authenticateUser, getCustomerById);
router.put("/:id", authenticateUser, updateCustomer);
router.delete("/:id", authenticateUser, deleteCustomer);
router.put("/:id/balance", authenticateUser, updateCustomerBalance);

export default router;
