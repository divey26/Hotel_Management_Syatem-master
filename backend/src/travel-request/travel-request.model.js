const mongoose = require("mongoose");

const travelRequestSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  passengers: {
    type: Number,
  },
  travelType: {
    type: String,
    enum: ["food-delivery", "customer-travel"],
    required: true,
  },
  startupLocation: {
    type: String,
    required: true,
  },
  endupLocation: {
    type: String,
    required: true,
  },
  travelStartDateTime: {
    type: Date,
  },
  travelEndDateTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
  },
});

const TravelRequest = mongoose.model("TravelRequest", travelRequestSchema);

module.exports = TravelRequest;
