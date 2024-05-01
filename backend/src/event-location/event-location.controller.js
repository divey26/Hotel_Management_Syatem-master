const EventLocationService = require("./event-location.service");

const createEventLocation = async (req, res) => {
  try {
    const newEventLocation = await EventLocationService.createEventLocation(req.body);
    res.status(201).json({
      success: true,
      data: newEventLocation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getEventLocations = async (req, res) => {
  try {
    const EventLocations = await EventLocationService.getEventLocations();
    res.status(200).json({
      success: true,
      data: EventLocations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEventLocationById = async (req, res) => {
  try {
    const EventLocation = await EventLocationService.getEventLocationById(req.params.id);
    if (!EventLocation) {
      return res.status(404).json({
        success: false,
        message: "EventLocation not found",
      });
    }
    res.status(200).json({
      success: true,
      data: EventLocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEventLocation = async (req, res) => {
  try {
    const updatedEventLocation = await EventLocationService.updateEventLocation(
      req.params.id,
      req.body
    );
    if (!updatedEventLocation) {
      return res.status(404).json({
        success: false,
        message: "EventLocation not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedEventLocation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEventLocation = async (req, res) => {
  try {
    await EventLocationService.deleteEventLocation(req.params.id);
    res.status(200).json({
      success: true,
      message: "EventLocation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEventLocation,
  getEventLocations,
  getEventLocationById,
  updateEventLocation,
  deleteEventLocation,
};
