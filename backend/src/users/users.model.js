const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String,
  },
  userType: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
