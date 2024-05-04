const Event = require("./event.model");
const generateUniqueId = require("../common/generate-key");

const createEvent = async (eventData) => {
  try {
    eventData.eventId = generateUniqueId("EV");
    const event = new Event(eventData);
    await event.save();
    return event;
  } catch (error) {
    throw error;
  }
};

const getEvents = async () => {
  try {
    const event = await Event.find().populate("locations");
    return event;
  } catch (error) {
    throw error;
  }
};

const getEventById = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return event;
  } catch (error) {
    throw error;
  }
};

const updateEvent = async (eventId, eventData) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, {
      new: true,
    });
    return updatedEvent;
  } catch (error) {
    throw error;
  }
};

const deleteEvent = async (eventId) => {
  try {
    await Event.findByIdAndDelete(eventId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  getEventById,
  deleteEvent,
};
