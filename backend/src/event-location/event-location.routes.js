const express = require("express");
const router = express.Router();
const eventLocationController = require("./event-location.controller");
const { verifyToken } = require("../auth/auth");

// Routes for eventLocation operations with token verification
router.post("/", eventLocationController.createEventLocation);
router.get("/", eventLocationController.getEventLocations);
router.get("/:id", eventLocationController.getEventLocationById);
router.put("/:id", eventLocationController.updateEventLocation);
router.delete("/:id", eventLocationController.deleteEventLocation);

module.exports = router;
