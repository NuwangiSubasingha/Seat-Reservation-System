// import express from "express";
// import Reservation from "../models/Reservation.js";
// import Seat from "../models/Seat.js";

// const router = express.Router();

// // GET all reservations
// router.get("/", async (req, res) => {
//   try {
//     const reservations = await Reservation.find().populate("seat");
//     res.json(reservations);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // CREATE a reservation
// router.post("/", async (req, res) => {
//   const { seatId, userName } = req.body;
//   try {
//     const seat = await Seat.findById(seatId);
//     if (!seat) return res.status(404).json({ message: "Seat not found" });
//     if (seat.isBooked) return res.status(400).json({ message: "Seat already booked" });

//     seat.isBooked = true;
//     await seat.save();

//     const reservation = new Reservation({ seat: seatId, userName });
//     await reservation.save();

//     res.json(reservation);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // CANCEL a reservation
// router.delete("/:id", async (req, res) => {
//   try {
//     const reservation = await Reservation.findById(req.params.id);
//     if (!reservation) return res.status(404).json({ message: "Reservation not found" });

//     const seat = await Seat.findById(reservation.seat);
//     if (seat) {
//       seat.isBooked = false;
//       await seat.save();
//     }

//     await reservation.remove();
//     res.json({ message: "Reservation canceled" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

import express from "express";
import Reservation from "../models/Reservation.js";
import Seat from "../models/Seat.js";
import authMiddleware from "../middleware/auth.js"; // JWT auth middleware

const router = express.Router();

// Get reservations for logged-in user
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // set by auth middleware
    const reservations = await Reservation.find({ user: userId }).populate("seat");
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel reservation
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    // Only allow owner to cancel
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Free the seat
    const seat = await Seat.findById(reservation.seat);
    if (seat) {
      seat.isBooked = false;
      await seat.save();
    }

    await reservation.remove();
    res.json({ message: "Reservation canceled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
