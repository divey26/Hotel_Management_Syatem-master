const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  amenities: {
    type: Array,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrls: {
    type: Array,
  },
  capacity: {
    type: Number,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
