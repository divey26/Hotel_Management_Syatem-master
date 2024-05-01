const EventService = require("./event.service");

const createEvent = async (req, res) => {
  try {
    const event = await EventService.createEvent(req.body);
    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await EventService.getEvents();
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const Event = await EventService.getEventById(req.params.id);
    if (!Event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    res.status(200).json({
      success: true,
      data: Event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await EventService.updateEvent(
      req.params.id,
      req.body
    );
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await EventService.deleteEvent(req.params.id);
    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  getEventById,
  deleteEvent,
};
