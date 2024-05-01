const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Cancelled",
      "Processing",
      "Ready-to-deliver",
      "Waiting-for-pickup",
      "Picked-up",
      "Delivered",
    ],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FoodOrder = mongoose.model("FoodOrder", OrderSchema);

module.exports = FoodOrder;
