// import express from "express";
// import Seat from "../models/Seat.js";

// const router = express.Router();

// // GET all seats
// // router.get("/", async (req, res) => {
// //   try {
// //     const seats = await Seat.find();
// //     res.json(seats.map(s => ({
// //       SeatID: s.seatId,
// //       SeatNumber: s.SeatNumber,
// //       Location: s.Location,
// //       Status: s.Status
// //     })));
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // Get all seats
// router.get("/", async (req, res) => {
//   try {
//     const seats = await Seat.find({});
//     res.json(seats); // each seat has _id, SeatNumber, Location, Status
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ADD a new seat
// router.post("/", async (req, res) => {
//   const { seatId, SeatNumber, Location } = req.body;
//   try {
//     const newSeat = new Seat({ seatId, SeatNumber, Location, Status: "Available" });
//     await newSeat.save();
//     res.json({
//       SeatID: newSeat.seatId,
//       SeatNumber: newSeat.SeatNumber,
//       Location: newSeat.Location,
//       Status: newSeat.Status
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE a seat
// router.delete("/:id", async (req, res) => {
//   try {
//     const removedSeat = await Seat.findByIdAndDelete(req.params.id);
//     res.json(removedSeat);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

import express from "express";
import Seat from "../models/Seat.js";

const router = express.Router();

// Get all seats
router.get("/", async (req, res) => {
  try {
    const seats = await Seat.find({});
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new seat
router.post("/", async (req, res) => {
  try {
    // Use defaults if missing
    const seatId = req.body.seatId || `S${Date.now()}`; // unique fallback
    const SeatNumber = req.body.SeatNumber;
    const Location = req.body.Location || "Default Location";

    if (!SeatNumber) {
      return res.status(400).json({ error: "SeatNumber is required" });
    }

    const newSeat = new Seat({ seatId, SeatNumber, Location });
    await newSeat.save();

    res.status(201).json(newSeat);
  } catch (err) {
    console.error("Error in POST /seats:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete a seat
router.delete("/:id", async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);
    if (!seat) return res.status(404).json({ error: "Seat not found" });
    res.json({ message: "Seat removed", seatId: seat._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
