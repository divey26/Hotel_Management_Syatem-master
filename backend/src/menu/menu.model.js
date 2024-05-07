const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  menuId: {
    type: String,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    enum: ["food", "beverage","dessert"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrls: {
    type: Array,
  },
  availability: {
    type: Array,
  },
  meal: {
    type: Array,
  },
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
