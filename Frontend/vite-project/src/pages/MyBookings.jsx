import React, { useEffect, useState } from "react";
import API from "../api";
import "../Css/Doctor.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to view your bookings");
      return;
    }

    API.get("/appointments/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error("MyBookings error:", err);
        alert("Failed to load bookings");
      });
  }, []);

  return (
    <div className="doctor-container">
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No doctors booked yet.</p>
      ) : (
        bookings.map((doc) => (
          <div className="doctor-card" key={doc._id}>
            <h4 className="doctor-header">{doc.name}</h4>
            <p className="doctor-speclization">{doc.specialization}</p>

            <div className="availability-section">
              {doc.availability.map((slot, index) => (
                <div key={index} className="slot-box">
                
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;
