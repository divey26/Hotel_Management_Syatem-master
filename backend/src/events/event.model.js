const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventId: {
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
  imageUrls: {
    type: Array,
  },
  locations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventLocation",
    },
  ],
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
