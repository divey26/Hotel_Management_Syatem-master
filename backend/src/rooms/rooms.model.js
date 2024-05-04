const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true,
    required: true,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  amenities: {
    type: Array,
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
