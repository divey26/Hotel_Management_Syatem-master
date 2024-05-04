const mongoose = require("mongoose");

const AdditionalServiceSchema = new mongoose.Schema({
  serviceId: {
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
});

const AdditionalService = mongoose.model(
  "AdditionalService",
  AdditionalServiceSchema
);

module.exports = AdditionalService;
