const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  timeSlots: [String],
});

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  availability: [availabilitySchema],
  available: { type: Boolean, default: true },
  isPresent: { type: Boolean, default: true },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
