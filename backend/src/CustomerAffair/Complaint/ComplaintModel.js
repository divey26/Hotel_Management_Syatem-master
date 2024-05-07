const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  category: { type: String, required: true },
  details: { type: String, required: true },
  attachments: { type: String },

}); 

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
