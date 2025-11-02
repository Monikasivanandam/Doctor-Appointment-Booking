import React, { useEffect, useState } from "react";
import API from "../api";
import "../Css/Doctor.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState({});
  const [selectedTime, setSelectedTime] = useState({});

  
  useEffect(() => {
    API.get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  
  const bookDoctor = (doctorId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book an appointment");
      return;
    }

    const date = selectedDate[doctorId];
    const time = selectedTime[doctorId];

    if (!date || !time) {
      alert("Please select both date and time");
      return;
    }

    API.post(
      `/doctors/book/${doctorId}`,
      { date, time },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(() => alert("Doctor booked successfully!"))
      .catch((err) => console.error("Booking error:", err));
  };

  return (
    <div className="doctor-container">
      <h2>Available Doctors</h2>

      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        doctors.map((doc) => (
          <div className="doctor-card" key={doc._id}>
            <h3>{doc.name}</h3>
            <p><strong>Specialization:</strong> {doc.specialization}</p>

            <p>
              <strong>Status: </strong>
              <span
                style={{
                  color: doc.isPresent ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {doc.isPresent ? "🟢 Present" : "🔴 Absent"}
              </span>
            </p>

            {doc.availability && doc.availability.length > 0 ? (
              <div className="dropdowns">
                <label><strong>Select Date:</strong></label>
                <select
                  value={selectedDate[doc._id] || ""}
                  onChange={(e) => {
                    const date = e.target.value;
                    setSelectedDate((prev) => ({ ...prev, [doc._id]: date }));
                    setSelectedTime((prev) => ({ ...prev, [doc._id]: "" }));
                  }}
                >
                  <option value="">-- Select Date --</option>
                  {doc.availability.map((slot, i) => (
                    <option key={i} value={slot.date}>
                      {slot.date}
                    </option>
                  ))}
                </select>

                {selectedDate[doc._id] && (
                  <>
                    <label><strong>Select Time:</strong></label>
                    <select
                      value={selectedTime[doc._id] || ""}
                      onChange={(e) =>
                        setSelectedTime((prev) => ({
                          ...prev,
                          [doc._id]: e.target.value,
                        }))
                      }
                    >
                      <option value="">-- Select Time --</option>
                      {doc.availability
                        .find((a) => a.date === selectedDate[doc._id])
                        ?.timeSlots.map((time, i) => (
                          <option key={i} value={time}>
                            {time}
                          </option>
                        ))}
                    </select>
                  </>
                )}
              </div>
            ) : (
              <p>No available dates</p>
            )}

            <button
              className="book-button"
              disabled={!doc.isPresent || !doc.available}
              onClick={() => bookDoctor(doc._id)}
            >
              {doc.isPresent && doc.available ? "Book Appointment" : "Unavailable"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Doctors;
