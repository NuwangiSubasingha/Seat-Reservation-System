import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api";
import { FaChair, FaArrowLeft, FaArrowRight } from "react-icons/fa"; // ← added arrows

const Booking = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ date: "", selectedSeats: [] });
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [userBookingExists, setUserBookingExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const seatsPerPage = 20;

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

  // Pagination
  const totalPages = Math.ceil(seats.length / seatsPerPage);
  const startIndex = (currentPage - 1) * seatsPerPage;
  const currentSeats = seats.slice(startIndex, startIndex + seatsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setForm((prev) => ({ ...prev, selectedSeats: [] })); // reset selection
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-300 relative">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-11/12 max-w-6xl p-8 bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Booking Form */}
     <div className="mt-5">
  <h1 className="text-4xl font-extrabold text-blue-900 mb-20">Book Your Seat</h1> {/* increased mb from 6 → 10 */}
  <form onSubmit={handleSubmit} className="space-y-10"> {/* increased spacing from 5 → 8 */}
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
  {currentSeats.map((seat) => {
    const isBooked = bookedSeats.includes(seat.SeatNumber);
    const isSelected = form.selectedSeats.includes(seat.SeatNumber);
    return (
      <motion.div
        key={seat._id}
        whileHover={{ scale: !isBooked ? 1.1 : 1 }}
        whileTap={{ scale: !isBooked ? 0.95 : 1 }}
        onClick={() => toggleSeat(seat.SeatNumber)}
        className={`w-12 h-16 flex flex-col items-center justify-center rounded-lg cursor-pointer ${
          isBooked
            ? "bg-red-400 cursor-not-allowed"
            : isSelected
            ? "bg-green-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        <FaChair className="mb-1" /> {/* add small bottom margin */}
        <span className="text-sm font-medium text-gray-700">
          {seat.SeatNumber}
        </span>
      </motion.div>
    );
  })}
</div>

          {/* Pagination */}
          <div className="flex mt-6 gap-2 items-center">
            <button
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            >
              <FaArrowLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-900 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            >
              <FaArrowRight />
            </button>
          </div>

          <p className="mt-4 text-gray-500 text-sm">  🔴 Booked    |   🟢 Selected</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Booking;
