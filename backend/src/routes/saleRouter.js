import express from 'express';
import { createSale } from '../controllers/saleController';


const router = express.Router()


router.post("/", createSale)


export default router;