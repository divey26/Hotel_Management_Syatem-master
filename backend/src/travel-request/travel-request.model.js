const mongoose = require("mongoose");

const travelRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodOrder",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
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
  requests: {
    type: String,
  },
  cancelReason: {
    type: String,
  },
});

const TravelRequest = mongoose.model("TravelRequest", travelRequestSchema);

module.exports = TravelRequest;
