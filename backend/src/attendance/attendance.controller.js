const AttendanceService = require("./attendance.service");

const createAttendance = async (req, res) => {
  try {
    const Attendance = await AttendanceService.createAttendance(req.body);
    res.status(201).json({
      success: true,
      data: Attendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAttendances = async (req, res) => {
  try {
    const Attendances = await AttendanceService.getAttendances();
    res.status(200).json({
      success: true,
      data: Attendances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const Attendance = await AttendanceService.getAttendanceById(req.params.id);
    if (!Attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }
    res.status(200).json({
      success: true,
      data: Attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAttendancesByUserId = async (req, res) => {
  try {
    const Attendances = await AttendanceService.getAttendancesByUserId(req.params.id);
    res.status(200).json({
      success: true,
      data: Attendances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const updatedAttendance = await AttendanceService.updateAttendance(
      req.params.id,
      req.body
    );
    if (!updatedAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedAttendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    await AttendanceService.deleteAttendance(req.params.id);
    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAttendance,
  getAttendances,
  getAttendancesByUserId,
  updateAttendance,
  getAttendanceById,
  deleteAttendance,
};
