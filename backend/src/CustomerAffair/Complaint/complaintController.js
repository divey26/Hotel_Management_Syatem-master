// complaintController.js
const Complaint = require("./ComplaintModel");

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.status(201).json({ message: "Complaint created successfully", complaint });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComplaint = await Complaint.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Complaint updated successfully", complaint: updatedComplaint });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComplaint = await Complaint.findByIdAndDelete(id);
    if (!deletedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
