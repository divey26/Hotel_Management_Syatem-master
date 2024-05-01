const LeaveRequest = require("./leave-request.model");

const createLeaveRequest = async (LeaveRequestData) => {
  try {
    const leaveRequest = new LeaveRequest(LeaveRequestData);
    await leaveRequest.save();
    return leaveRequest;
  } catch (error) {
    throw error;
  }
};

const getLeaveRequests = async () => {
  try {
    const leaveRequests = await LeaveRequest.find();
    return leaveRequests;
  } catch (error) {
    throw error;
  }
};

const getLeaveRequestById = async (LeaveRequestId) => {
  try {
    const leaveRequest = await LeaveRequest.findById(LeaveRequestId);
    return leaveRequest;
  } catch (error) {
    throw error;
  }
};
const getLeaveByUserId = async (userId) => {
  try {
    const leave = await LeaveRequest.find({ employee: userId })
      .populate("employee")
    return leave;
  } catch (error) {
    throw error;
  }
};
const updateLeaveRequest = async (leaveRequestId, leaveRequestData) => {
  try {
    const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
      leaveRequestId,
      leaveRequestData,
      {
        new: true,
      }
    );
    return updatedLeaveRequest;
  } catch (error) {
    throw error;
  }
};

const deleteLeaveRequest = async (leaveRequestId) => {
  try {
    await LeaveRequest.findByIdAndDelete(leaveRequestId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequestById,
  updateLeaveRequest,
  deleteLeaveRequest,
  getLeaveByUserId,
};
