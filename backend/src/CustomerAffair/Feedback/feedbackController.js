const Feedback = require("./FeedbackModel");

exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: "Feedback created successfully", feedback });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeedback = await Feedback.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json({ message: "Feedback updated successfully", feedback: updatedFeedback });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
