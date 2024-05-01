const express = require("express");
const router = express.Router();
const travelRequestController = require("./travel-request.controller");

// Routes for travelRequest operations
router.post("/", travelRequestController.createTravelRequest);
router.get("/", travelRequestController.getTravelRequests);
router.get("/:id", travelRequestController.getTravelRequestById);
router.get("/user/:id", travelRequestController.getTravelRequestsByUserId);
router.put("/:id", travelRequestController.updateTravelRequest);
router.delete("/:id", travelRequestController.deleteTravelRequest);

module.exports = router;
