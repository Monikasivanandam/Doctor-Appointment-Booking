const Appointment = require("../models/Appointment");

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate("doctor", "name specialization");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
