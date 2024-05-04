const mongoose = require("mongoose");

const eventLocationSchema = new mongoose.Schema({
  locationId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  amenities: {
    type: Array,
    required: true,
  },
  imageUrls: {
    type: Array,
  },
  noOfSeats: {
    type: Number,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
  },
});

const EventLocation = mongoose.model("EventLocation", eventLocationSchema);

module.exports = EventLocation;
