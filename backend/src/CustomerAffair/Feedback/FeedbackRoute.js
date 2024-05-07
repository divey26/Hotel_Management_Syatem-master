// feedbackRoutes.js
const express = require("express");
const router = express.Router();
const feedbackController = require("./feedbackController");

// Define routes
router.get("/", feedbackController.getAllFeedback);
router.get("/:id", feedbackController.getFeedbackById);
router.post("/", feedbackController.createFeedback);
router.put("/:id", feedbackController.updateFeedback);
router.delete("/:id", feedbackController.deleteFeedback);

module.exports = router;
