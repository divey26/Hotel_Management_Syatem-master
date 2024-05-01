const express = require("express");
const router = express.Router();
const supplierController = require("./supplier.controller");
const { verifyToken } = require("../auth/auth");

router.post("/", verifyToken, supplierController.createSupplier);
router.get("/", supplierController.getSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.put("/:id", verifyToken, supplierController.updateSupplier);
router.delete("/:id", verifyToken, supplierController.deleteSupplier);

module.exports = router;
