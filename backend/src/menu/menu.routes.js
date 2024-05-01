const express = require("express");
const router = express.Router();
const menuController = require("./menu.controller");

// Routes for room operations
router.post("/", menuController.createMenuItem);
router.get("/", menuController.getMenuItems);
router.get("/:id", menuController.getMenuItemById);
router.put("/:id", menuController.updateMenuItem);
router.delete("/:id", menuController.deleteMenuItem);

module.exports = router;
