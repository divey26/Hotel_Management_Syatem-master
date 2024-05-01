const express = require("express");
const router = express.Router();
const attendanceController = require("./attendance.controller");

router.post("/", attendanceController.createAttendance);
router.get("/", attendanceController.getAttendances);
router.get("/user/:id", attendanceController.getAttendancesByUserId);
router.get("/:id", attendanceController.getAttendanceById);
router.put("/:id", attendanceController.updateAttendance);
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;
