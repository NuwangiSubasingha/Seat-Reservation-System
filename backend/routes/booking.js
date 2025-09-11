// import express from "express";
// import Booking from "../models/Booking.js";
// import Seat from "../models/Seat.js";
// import authMiddleware from "../middleware/auth.js";

// const router = express.Router();

// // 1️⃣ Get booked seats for a datetime
// router.get("/booked-seats/:datetime", async (req, res) => {
//   try {
//     const { datetime } = req.params;
//     const bookings = await Booking.find({ datetime });
//     const bookedSeats = bookings.flatMap((b) => b.selectedSeats);
//     res.json(bookedSeats);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // 2️⃣ Create a booking
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { datetime, selectedSeats, userId } = req.body;

//     // Check if seats already booked
//     const existingBookings = await Booking.find({ datetime });
//     const allBooked = existingBookings.flatMap((b) => b.selectedSeats);
//     const conflict = selectedSeats.some((s) => allBooked.includes(s));
//     if (conflict) return res.status(400).json({ msg: "Some seats are already booked" });

//     // ✅ Save booking
//     const newBooking = new Booking({ datetime, selectedSeats, userId });
//     await newBooking.save();

//     // ✅ Update Seat collection
//     await Seat.updateMany(
//       { label: { $in: selectedSeats } }, 
//       { $set: { isBooked: true } }
//     );

//     res.json({ msg: "Booking successful!", booking: newBooking });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // 3️⃣ Cancel booking & free seats
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ msg: "Booking not found" });

//     if (booking.userId.toString() !== req.user.id) {
//       return res.status(403).json({ msg: "Not authorized" });
//     }

//     // Free the seats
//     await Seat.updateMany(
//       { label: { $in: booking.selectedSeats } }, 
//       { $set: { isBooked: false } }
//     );

//     await booking.deleteOne();
//     res.json({ msg: "Booking canceled" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// export default router;

// 