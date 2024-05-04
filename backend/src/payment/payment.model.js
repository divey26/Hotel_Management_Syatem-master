const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodOrder",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paidOn: {
    type: Date,
    required: true,
  },
  paidVia: {
    type: String,
    enum: ["online", "cashOn"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Received", "Declined", "Cancelled","Refunded"],
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
