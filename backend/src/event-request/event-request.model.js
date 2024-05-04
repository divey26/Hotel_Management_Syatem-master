const mongoose = require("mongoose");

const EventRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true,
  },
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
  cancelReason: {
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
