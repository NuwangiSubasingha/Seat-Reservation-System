import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api";
import { FaChair } from "react-icons/fa";

const Booking = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ date: "", selectedSeats: [] });
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [userBookingExists, setUserBookingExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await API.get("/seats");
        setSeats(res.data);
      } catch (err) {
        console.error("Error fetching seats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, []);

  useEffect(() => {
    if (!form.date) return;

    const fetchBookedSeats = async () => {
      try {
        const res = await API.get(`/reservations/booked-seats/${form.date}`);
        const booked = res.data.map((b) => b.SeatID.SeatNumber);
        setBookedSeats(booked);

        const userHasBooking = res.data.some(
          (b) => b.InternID._id === user.id || b.InternID === user.id
        );
        setUserBookingExists(userHasBooking);
      } catch (err) {
        console.error("Error fetching booked seats", err);
      }
    };

    fetchBookedSeats();
  }, [form.date, user.id]);

  const toggleSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber) || userBookingExists) return;

    setForm((prev) => ({
      ...prev,
      selectedSeats: prev.selectedSeats.includes(seatNumber) ? [] : [seatNumber],
    }));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date) return alert("Please select a date.");
    if (form.selectedSeats.length === 0) return alert("Please select a seat.");

    const seatObj = seats.find((s) => s.SeatNumber === form.selectedSeats[0]);
    if (!seatObj || !seatObj._id) return alert("Seat not found");

    try {
      await API.post(
        "/reservations",
        { Date: form.date, SeatID: seatObj._id, TimeSlot: "09:00-12:00" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("✅ Booking successful!");
      setForm({ date: "", selectedSeats: [] });
      setBookedSeats([]);
      setUserBookingExists(false);
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    }
  };

  if (loading) return <p className="p-10 text-center">Loading seats...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-900 relative">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-11/12 max-w-6xl p-8 bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Booking Form */}
        <div>
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Book Your Seat</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            {userBookingExists && (
              <p className="text-red-500 text-sm mt-1">You have already booked a seat for this date.</p>
            )}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={userBookingExists || form.selectedSeats.length === 0}
              className={`w-full py-3 font-bold rounded-xl shadow-lg ${
                userBookingExists || form.selectedSeats.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900 text-white"
              }`}
            >
              Confirm Booking
            </motion.button>
          </form>
        </div>

        {/* Seat Selection */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Select Your Seat</h3>
          <div className="grid grid-cols-5 gap-4">
            {seats.map((seat) => {
              const isBooked = bookedSeats.includes(seat.SeatNumber);
              const isSelected = form.selectedSeats.includes(seat.SeatNumber);
              return (
                <motion.div
                  key={seat._id}
                  whileHover={{ scale: !isBooked ? 1.1 : 1 }}
                  whileTap={{ scale: !isBooked ? 0.95 : 1 }}
                  onClick={() => toggleSeat(seat.SeatNumber)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer ${
                    isBooked
                      ? "bg-red-400 cursor-not-allowed"
                      : isSelected
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaChair />
                </motion.div>
              );
            })}
          </div>
          <p className="mt-4 text-gray-500 text-sm">✅ Available | 🔴 Booked | 🟢 Selected</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Booking;
