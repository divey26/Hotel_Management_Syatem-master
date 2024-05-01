const mongoose = require("mongoose");

const additionalServiceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdditionalService",
    required: true,
  },
  noOfPersons: {
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

const AdditionalServiceRequest = mongoose.model(
  "additionalServiceRequest",
  additionalServiceRequestSchema
);

module.exports = AdditionalServiceRequest;
