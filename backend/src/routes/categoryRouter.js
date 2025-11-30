const express = require("express");
const Product = require("../models/categoryModel.js")
const router = express.Router();
const {getCategory, getCategories, createCategory, updateCategory, deleteCategory} = require ("../controllers/categoryController.js");

router.get('/', getCategories);
router.put('/:id', getCategory);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;