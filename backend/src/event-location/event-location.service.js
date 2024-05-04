const EventLocation = require("./event-location.model");
const generateUniqueId = require("../common/generate-key");

const createEventLocation = async (eventLocationData) => {
  try {
    eventLocationData.locationId = generateUniqueId("LOC")
    const newEventLocation = await EventLocation.create(eventLocationData);
    return newEventLocation;
  } catch (error) {
    throw error;
  }
};

const getEventLocations = async () => {
  try {
    const EventLocations = await EventLocation.find();
    return EventLocations;
  } catch (error) {
    throw error;
  }
};

const getEventLocationById = async (EventLocationId) => {
  try {
    const EventLocation = await EventLocation.findById(EventLocationId);
    return EventLocation;
  } catch (error) {
    throw error;
  }
};

const updateEventLocation = async (EventLocationId, EventLocationData) => {
  try {
    const updatedEventLocation = await EventLocation.findByIdAndUpdate(
      EventLocationId,
      EventLocationData,
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedEventLocation;
  } catch (error) {
    throw error;
  }
};

const deleteEventLocation = async (EventLocationId) => {
  try {
    await EventLocation.findByIdAndDelete(EventLocationId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEventLocation,
  getEventLocations,
  getEventLocationById,
  updateEventLocation,
  deleteEventLocation,
};
