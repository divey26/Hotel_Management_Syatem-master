const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  stockId: {
    type: String,
    unique: true,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  unit: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
