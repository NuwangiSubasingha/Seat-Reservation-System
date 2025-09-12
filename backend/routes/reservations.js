import express from "express";
import Reservation from "../models/Reservation.js";
import Seat from "../models/Seat.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ✅ Get reservations of logged-in user
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find({ InternID: req.user.id })
      .populate("SeatID");

    res.json(
      reservations.map((r) => ({
        ReservationID: r._id,
        InternID: r.InternID,
        SeatID: r.SeatID,
        Date: r.Date,
        TimeSlot: r.TimeSlot,
        Status: r.Status,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create reservation – one per day per user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { SeatID, Date, TimeSlot } = req.body;
    const InternID = req.user.id;

    // Prevent multiple bookings same day
    const existingBooking = await Reservation.findOne({
      InternID,
      Date,
      Status: "Active",
    });
    if (existingBooking) {
      return res.status(400).json({ error: "You can only book 1 seat per day" });
    }

    // Prevent seat double booking
    const conflict = await Reservation.findOne({ SeatID, Date, Status: "Active" });
    if (conflict) {
      return res
        .status(400)
        .json({ error: "Seat already reserved for this date" });
    }

    // Create reservation
    const reservation = new Reservation({
      InternID,
      SeatID,
      Date,
      TimeSlot,
      Status: "Active",
    });
    await reservation.save();

    await Seat.findByIdAndUpdate(SeatID, { Status: "Unavailable" });

    res.status(201).json({
      message: "Reservation created",
      ReservationID: reservation._id,
      SeatID: reservation.SeatID,
      Date: reservation.Date,
      TimeSlot: reservation.TimeSlot,
      Status: reservation.Status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Cancel reservation
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    if (reservation.InternID.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    reservation.Status = "Cancelled";
    await reservation.save();

    await Seat.findByIdAndUpdate(reservation.SeatID, { Status: "Available" });

    res.json({ message: "Reservation cancelled", ReservationID: reservation._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get booked seats for a specific date
router.get("/booked-seats/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const reservations = await Reservation.find({ Date: date, Status: "Active" })
      .populate("SeatID");
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin - View all reservations (filter by date or User ID)
router.get("/admin", async (req, res) => {
  try {
    const { date, user } = req.query;
    let query = {};

    if (date) query.Date = date;

    // Build consistent user mapping
    const allUsers = await Reservation.distinct("InternID");
    allUsers.sort(); // ensure consistent order
    const userMap = {};
    allUsers.forEach((id, index) => {
      userMap[`U${(index + 1).toString().padStart(3, "0")}`] = id;
    });

    if (user) {
      if (userMap[user]) {
        query.InternID = userMap[user];
      } else {
        return res.json([]); // no match
      }
    }

    const reservations = await Reservation.find(query).populate("SeatID");

    res.json(
      reservations.map((r) => {
        // find matching user code (U001, etc.)
        const userCode = Object.keys(userMap).find(
          (key) => userMap[key] === r.InternID.toString()
        );

        return {
          ReservationID: r._id,
          UserCode: userCode, // <-- formatted user ID
          SeatID: r.SeatID,
          Date: r.Date,
          TimeSlot: r.TimeSlot,
          Status: r.Status,
        };
      })
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
