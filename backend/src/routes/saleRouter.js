import express from 'express';
import { createSale } from '../controllers/saleController';


const router = express.Router()


router.post("/sale", createSale)


export default router;