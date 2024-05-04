const express = require("express");
const router = express.Router();
const roomController = require("./rooms.controller");
const { verifyToken } = require("../auth/auth");

// Routes for room operations with token verification
router.post("/", roomController.createRoom);
router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoomById);
router.put("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);
router.post("/available-rooms", roomController.getAvailableRooms);

module.exports = router;
