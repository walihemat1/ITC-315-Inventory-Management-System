const express = require("express");
const Supplier = require("../models/supplierModel.js")
const router = express.Router();
const {getSupplier, getSuppliers, createSupplier, updateSupplier, deleteSupplier} = require ("../controllers/supplierController.js");

router.get('/', getSuppliers);
router.put('/:id', getSupplier);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;