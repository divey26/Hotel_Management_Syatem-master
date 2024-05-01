const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
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
