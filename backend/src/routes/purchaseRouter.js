import express from 'express'

const router = express.Router()


router.post("/purchase", purchaseController.createPurchase);



export default router;

