const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      unique: true,
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Car", "Van", "Motorcycle"],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    imageUrls: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
