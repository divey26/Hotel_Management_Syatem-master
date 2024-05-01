const express = require("express");
const router = express.Router();
const customerController = require("./customer.controller");

// Routes for customer operations
router.post("/register", customerController.register);
router.post("/login", customerController.login);
router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
