const express = require("express");
const router = express.Router();
const driverController = require("./driver.controller");

// Routes for driver operations
router.post("/", driverController.createDriver);
router.get("/", driverController.getDrivers);
router.get("/:id", driverController.getDriverById);
router.put("/:id", driverController.updateDriver);
router.delete("/:id", driverController.deleteDriver);

module.exports = router;
