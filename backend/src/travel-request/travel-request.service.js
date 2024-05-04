const TravelRequest = require("./travel-request.model");
const generateUniqueId = require("../common/generate-key");

const createTravelRequest = async (travelRequestData) => {
  try {
    travelRequestData.requestId = generateUniqueId("TR");
    const travelRequest = new TravelRequest(travelRequestData);
    await travelRequest.save();
    return travelRequest;
  } catch (error) {
    throw error;
  }
};

const getTravelRequests = async () => {
  try {
    const travelRequests = await TravelRequest.find()
      .populate("user")
      .populate("order")
      .populate("driver")
      .populate("vehicle");
    return travelRequests;
  } catch (error) {
    throw error;
  }
};

const getTravelRequestById = async (travelRequestId) => {
  try {
    const travelRequest = await TravelRequest.findById(travelRequestId)
      .populate("user")
      .populate("order")
      .populate("driver")
      .populate("vehicle");
    return travelRequest;
  } catch (error) {
    throw error;
  }
};

const getTravelRequestsByUserId = async (userId) => {
  try {
    const requests = await TravelRequest.find({ user: userId })
      .populate("user")
      .populate("driver")
      .populate("vehicle");
    return requests;
  } catch (error) {
    throw error;
  }
};

const updateTravelRequest = async (travelRequestId, travelRequestData) => {
  try {
    const updatedTravelRequest = await TravelRequest.findByIdAndUpdate(
      travelRequestId,
      travelRequestData,
      {
        new: true,
      }
    );
    return updatedTravelRequest;
  } catch (error) {
    throw error;
  }
};

const deleteTravelRequest = async (travelRequestId) => {
  try {
    await TravelRequest.findByIdAndDelete(travelRequestId);
  } catch (error) {
    throw error;
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
