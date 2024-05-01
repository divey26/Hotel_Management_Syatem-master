const TravelRequest = require("./travel-request.model");

const createTravelRequest = async (travelRequestData) => {
  try {
    const travelRequest = new TravelRequest(travelRequestData);
    await travelRequest.save();
    return travelRequest;
  } catch (error) {
    throw error;
  }
};

const getTravelRequests = async () => {
  try {
    const travelRequests = await TravelRequest.find();
    return travelRequests;
  } catch (error) {
    throw error;
  }
};

const getTravelRequestById = async (travelRequestId) => {
  try {
    const travelRequest = await TravelRequest.findById(travelRequestId);
    return travelRequest;
  } catch (error) {
    throw error;
  }
};

const getTravelRequestsByUserId = async (userId) => {
  try {
    const requests = await TravelRequest.find({ user: userId })
      .populate("user")
      .populate("order");
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
