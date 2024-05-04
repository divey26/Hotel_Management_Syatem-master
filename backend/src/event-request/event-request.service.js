const EventRequest = require("./event-request.model");
const generateUniqueId = require("../common/generate-key");

const createEventRequest = async (eventRequestData) => {
  try {
    eventRequestData.requestId = generateUniqueId("ER");
    const eventRequest = new EventRequest(eventRequestData);
    await eventRequest.save();
    return eventRequest;
  } catch (error) {
    throw error;
  }
};

const getEventRequests = async () => {
  try {
    const EventRequests = await EventRequest.find()
      .populate("user")
      .populate("location");
    return EventRequests;
  } catch (error) {
    throw error;
  }
};

const getEventRequestById = async (EventRequestId) => {
  try {
    const eventRequest = await EventRequest.findById(EventRequestId);
    return eventRequest;
  } catch (error) {
    throw error;
  }
};

const getEventRequestsByUserId = async (userId) => {
  try {
    const bookings = await EventRequest.find({ user: userId })
      .populate("user")
      .populate("location");
    return bookings;
  } catch (error) {
    throw error;
  }
};

const updateEventRequest = async (EventRequestId, EventRequestData) => {
  try {
    const updatedEventRequest = await EventRequest.findByIdAndUpdate(
      EventRequestId,
      EventRequestData,
      {
        new: true,
      }
    );
    return updatedEventRequest;
  } catch (error) {
    throw error;
  }
};

const deleteEventRequest = async (EventRequestId) => {
  try {
    await EventRequest.findByIdAndDelete(EventRequestId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEventRequest,
  getEventRequests,
  getEventRequestsByUserId,
  updateEventRequest,
  getEventRequestById,
  deleteEventRequest,
};
