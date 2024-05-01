const express = require("express");
const router = express.Router();
const eventRequestController = require("./event-request.controller");

router.post("/", eventRequestController.createEventRequest);
router.get("/", eventRequestController.getEventRequests);
router.get("/:id", eventRequestController.getEventRequestById);
router.get("/user/:id", eventRequestController.getEventRequestsByUserId);
router.put("/:id", eventRequestController.updateEventRequest);
router.delete("/:id", eventRequestController.deleteEventRequest);

module.exports = router;
