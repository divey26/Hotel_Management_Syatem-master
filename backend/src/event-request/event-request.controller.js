const EventRequestService = require("./event-request.service");

const createEventRequest = async (req, res) => {
  try {
    const EventRequest = await EventRequestService.createEventRequest(req.body);
    res.status(201).json({
      success: true,
      data: EventRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getEventRequests = async (req, res) => {
  try {
    const EventRequests = await EventRequestService.getEventRequests();
    res.status(200).json({
      success: true,
      data: EventRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEventRequestById = async (req, res) => {
  try {
    const EventRequest = await EventRequestService.getEventRequestById(req.params.id);
    if (!EventRequest) {
      return res.status(404).json({
        success: false,
        message: "EventRequest not found",
      });
    }
    res.status(200).json({
      success: true,
      data: EventRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEventRequestsByUserId = async (req, res) => {
  try {
    const eventBookings = await EventRequestService.getEventRequestsByUserId(req.params.id);
    res.status(200).json({
      success: true,
      data: eventBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEventRequest = async (req, res) => {
  try {
    const updatedEventRequest = await EventRequestService.updateEventRequest(
      req.params.id,
      req.body
    );
    if (!updatedEventRequest) {
      return res.status(404).json({
        success: false,
        message: "EventRequest not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedEventRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEventRequest = async (req, res) => {
  try {
    await EventRequestService.deleteEventRequest(req.params.id);
    res.status(200).json({
      success: true,
      message: "EventRequest deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEventRequest,
  getEventRequests,
  updateEventRequest,
  getEventRequestById,
  getEventRequestsByUserId,
  deleteEventRequest,
};
