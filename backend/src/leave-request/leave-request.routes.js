const express = require("express");
const router = express.Router();
const leaveRequestController = require("./leave-request.controller");

// Routes for leaveRequest operations
router.post("/", leaveRequestController.createLeaveRequest);
router.get("/", leaveRequestController.getLeaveRequests);
router.get("/:id", leaveRequestController.getLeaveRequestById);
router.put("/:id", leaveRequestController.updateLeaveRequest);
router.delete("/:id", leaveRequestController.deleteLeaveRequest);
router.get("/user/:id", leaveRequestController.getLeaveByUserId);

module.exports = router;
