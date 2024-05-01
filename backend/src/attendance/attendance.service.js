const Attendance = require("./attendance.model");

const createAttendance = async (attendanceData) => {
  try {
    const attendance = new Attendance(attendanceData);
    await attendance.save();
    return attendance;
  } catch (error) {
    throw error;
  }
};

const getAttendances = async () => {
  try {
    const attendances = await Attendance.find();
    return attendances;
  } catch (error) {
    throw error;
  }
};

const getAttendanceById = async (attendanceId) => {
  try {
    const attendance = await Attendance.findById(attendanceId);
    return attendance;
  } catch (error) {
    throw error;
  }
};
const getAttendancesByUserId = async (userId) => {
  try {
    const attendance = await Attendance.find({ employee: userId })
      .populate("employee")
    return attendance;
  } catch (error) {
    throw error;
  }
};
const updateAttendance = async (attendanceId, attendanceData) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      attendanceData,
      {
        new: true,
      }
    );
    return updatedAttendance;
  } catch (error) {
    throw error;
  }
};

const deleteAttendance = async (attendanceId) => {
  try {
    await Attendance.findByIdAndDelete(attendanceId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAttendance,
  getAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendancesByUserId,
};
