const express = require("express");
const router = express.Router();
const payrollController = require("./payroll.controller");

// Routes for payroll operations
router.post("/", payrollController.createPayroll);
router.get("/", payrollController.getPayrolls);
router.get("/:id", payrollController.getPayrollById);
router.put("/:id", payrollController.updatePayroll);
router.delete("/:id", payrollController.deletePayroll);

module.exports = router;
