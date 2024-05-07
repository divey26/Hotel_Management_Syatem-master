const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    attendanceId: {
      type: String,
      unique: true,
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    noOfHours: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Half-day"],
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

attendanceSchema.virtual("hoursWorked").get(function () {
  if (!this.endTime) {
    return 0; // If end time is not provided, return 0 hours
  }
  const diffInMilliseconds = this.endTime - this.startTime;
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
