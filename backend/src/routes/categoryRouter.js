import express from "express";

const router = express.Router();
import {
    getCategory, 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory} from 
    "../controllers/categoryController.js";

router.get('/', getCategories);
router.put('/:id', getCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;