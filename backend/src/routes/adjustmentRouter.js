import express from 'express'
import {adjustStock} from '../controllers/adjustmentController.js'


const router = express.Router()

router.post("/", adjustStock);


export default router;