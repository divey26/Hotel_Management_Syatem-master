const mongoose = require("mongoose");

const EventRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventLocation",
    required: true,
  },
  noOfGuests: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  requests: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
});

const EventRequest = mongoose.model("EventRequest", EventRequestSchema);

module.exports = EventRequest;
