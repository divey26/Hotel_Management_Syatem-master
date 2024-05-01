const TravelRequestService = require("./travel-request.service");

const createTravelRequest = async (req, res) => {
  try {
    const travelRequest = await TravelRequestService.createTravelRequest(
      req.body
    );
    res.status(201).json({
      success: true,
      data: travelRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getTravelRequests = async (req, res) => {
  try {
    const travelRequests = await TravelRequestService.getTravelRequests();
    res.status(200).json({
      success: true,
      data: travelRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTravelRequestById = async (req, res) => {
  try {
    const travelRequest = await TravelRequestService.getTravelRequestById(
      req.params.id
    );
    if (!travelRequest) {
      return res.status(404).json({
        success: false,
        message: "TravelRequestnot found",
      });
    }
    res.status(200).json({
      success: true,
      data: travelRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTravelRequestsByUserId = async (req, res) => {
  try {
    const requests = await TravelRequestService.getTravelRequestsByUserId(
      req.params.id
    );
    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTravelRequest = async (req, res) => {
  try {
    const updatedTravelRequest = await TravelRequestService.updateTravelRequest(
      req.params.id,
      req.body
    );
    if (!updatedTravelRequest) {
      return res.status(404).json({
        success: false,
        message: "TravelRequest not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedTravelRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTravelRequest = async (req, res) => {
  try {
    await TravelRequestService.deleteTravelRequest(req.params.id);
    res.status(200).json({
      success: true,
      message: "TravelRequest deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTravelRequest,
  getTravelRequests,
  getTravelRequestById,
  getTravelRequestsByUserId,
  updateTravelRequest,
  deleteTravelRequest,
};
