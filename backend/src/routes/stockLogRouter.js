import express from 'express'
import {getStockInHistory, getStockOutHistory} from '../controllers/stockLogController';


const router = express.Router()


router.get("/in", getStockInHistory);
router.get("/out", getStockOutHistory);

export default router;
