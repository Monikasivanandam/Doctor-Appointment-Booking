const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const authMiddleware = require("../middleware/auth");

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookedDoctors = await Doctor.find({ bookedBy: userId });
    res.json(bookedDoctors);
  } catch (err) {
    console.error("My bookings error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
