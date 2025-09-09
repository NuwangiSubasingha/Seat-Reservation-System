import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api";
import { FaChair } from "react-icons/fa";

const Booking = () => {
  const user = JSON.parse(localStorage.getItem("user")); // get logged-in user
  const [form, setForm] = useState({
    datetime: "",
    selectedSeats: [],
  });
  const [bookedSeats, setBookedSeats] = useState([]);

  // ✅ Fetch booked seats from backend
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const res = await API.get("/bookings/booked-seats"); // must return ["A1","A2"]
        setBookedSeats(res.data);
      } catch (err) {
        console.error("Error fetching booked seats", err);
      }
    };
    fetchBookedSeats();
  }, []);

  // ✅ Seat selection
  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return; // already booked
    if (user?.role === "Intern" && form.selectedSeats.length >= 1) return; // only 1 seat allowed
    setForm((prev) => {
      const isSelected = prev.selectedSeats.includes(seat);
      const newSeats = isSelected
        ? prev.selectedSeats.filter((s) => s !== seat)
        : [...prev.selectedSeats, seat];
      return { ...prev, selectedSeats: newSeats };
    });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.datetime) {
      alert("Please select a date and time.");
      return;
    }

    // ✅ Validation: at least 1 hour in advance
    const selectedDateTime = new Date(form.datetime);
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    if (selectedDateTime < oneHourLater) {
      alert("⏳ Bookings must be made at least 1 hour in advance.");
      return;
    }

    if (form.selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    try {
      await API.post("/bookings", { ...form, userId: user._id });
      alert("✅ Booking successful!");
      setForm({ datetime: "", selectedSeats: [] });
    } catch (err) {
      alert(err.response?.data?.msg || "Booking failed");
    }
  };

  // Simple seat layout
  const rows = ["A", "B", "C", "D"];
  const cols = [1, 2, 3, 4, 5];

  // ✅ Disable past times for datetime picker
  const minDateTime = new Date();
  const minDateTimeStr = new Date(
    minDateTime.getTime() + 60 * 60 * 1000
  ).toISOString().slice(0, 16); // enforce 1 hour ahead

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-900 relative">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-11/12 max-w-6xl p-8 bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* LEFT: Booking Form */}
        <div>
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6">
            Book Your Seat 
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="datetime-local"
              name="datetime"
              value={form.datetime}
              onChange={handleChange}
              min={minDateTimeStr} // ✅ prevents selecting past time
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl shadow-lg"
            >
              Confirm Booking
            </motion.button>
          </form>
        </div>

        {/* RIGHT: Seat Selector */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Select Your Seat</h3>
          <div className="grid grid-cols-5 gap-4">
            {rows.map((row) =>
              cols.map((col) => {
                const seat = row + col;
                const isBooked = bookedSeats.includes(seat);
                const isSelected = form.selectedSeats.includes(seat);
                return (
                  <motion.div
                    key={seat}
                    whileHover={{ scale: !isBooked ? 1.1 : 1 }}
                    whileTap={{ scale: !isBooked ? 0.95 : 1 }}
                    onClick={() => toggleSeat(seat)}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer 
                      ${isBooked ? "bg-red-400 cursor-not-allowed" : 
                      isSelected ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                  >
                    <FaChair />
                  </motion.div>
                );
              })
            )}
          </div>
          <p className="mt-4 text-gray-500 text-sm">
            ✅ Available | 🔴 Booked | 🟢 Selected
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Booking;
