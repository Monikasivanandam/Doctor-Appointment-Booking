const Doctor = require("../models/Doctor");

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.bookDoctor = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) return res.status(404).json({ error: "Doctor not found" });
        if (!doctor.available) return res.status(400).json({ error: "Already booked" });

        doctor.available = false;
        doctor.bookedBy = req.user.id;
        await doctor.save();

        res.json({ message: "Doctor booked successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
