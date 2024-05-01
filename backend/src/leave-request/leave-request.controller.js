const LeaveRequestService = require("./leave-request.services");

const createLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequestService.createLeaveRequest(req.body);
    res.status(201).json({
      success: true,
      data: leaveRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequestService.getLeaveRequests();
    res.status(200).json({
      success: true,
      data: leaveRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequestService.getLeaveRequestById(
      req.params.id
    );
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "LeaveRequest not found",
      });
    }
    res.status(200).json({
      success: true,
      data: leaveRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateLeaveRequest = async (req, res) => {
  try {
    const updatedLeaveRequest = await LeaveRequestService.updateLeaveRequest(
      req.params.id,
      req.body
    );
    if (!updatedLeaveRequest) {
      return res.status(404).json({
        success: false,
        message: "LeaveRequest not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedLeaveRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getLeaveByUserId = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequestService.getLeaveByUserId(req.params.id);
    res.status(200).json({
      success: true,
      data: leaveRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteLeaveRequest = async (req, res) => {
  try {
    await LeaveRequestService.deleteLeaveRequest(req.params.id);
    res.status(200).json({
      success: true,
      message: "LeaveRequest deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
