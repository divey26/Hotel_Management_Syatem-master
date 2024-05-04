const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  supplierId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
