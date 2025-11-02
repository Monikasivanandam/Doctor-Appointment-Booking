const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const authMiddleware = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    console.error("Get doctors error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/book/:id", authMiddleware, async (req, res) => {
  try {
    const { date, time } = req.body;
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    let slotFound = false;
    doctor.availability.forEach((slot) => {
      if (slot.date === date && slot.timeSlots.includes(time)) {
        slot.timeSlots = slot.timeSlots.filter((t) => t !== time);
        slotFound = true;
      }
    });

    if (!slotFound)
      return res.status(400).json({ error: "Selected slot not available" });

    doctor.bookedBy = req.user.userId;
    await doctor.save();

    res.json({ message: "Doctor booked successfully", doctor });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; 
