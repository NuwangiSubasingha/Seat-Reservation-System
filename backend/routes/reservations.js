import express from "express";
import Reservation from "../models/Reservation.js";
import Seat from "../models/Seat.js";
import authMiddleware from "../middleware/auth.js";
import { sendBookingEmail } from "../utils/mail.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Get reservations of logged-in user
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find({ InternID: req.user.id })
      .populate("SeatID")
      .populate("InternID", "userId");

    res.json(
      reservations.map((r) => ({
        ReservationID: r._id,
        ReadableID: r.ReadableID,
        InternID: r.InternID, // includes userId now
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

// ✅ Create reservation – one per day per user with email notification
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
      return res
        .status(400)
        .json({ error: "You can only book 1 seat per day" });
    }

    // Prevent seat double booking
    const conflict = await Reservation.findOne({
      SeatID,
      Date,
      Status: "Active",
    });
    if (conflict) {
      return res.status(400).json({ error: "Seat already reserved for this date" });
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

    // Update seat status
    await Seat.findByIdAndUpdate(SeatID, { Status: "Unavailable" });

    // 🔔 Fetch user and seat details for email
    const user = await User.findById(InternID);
    const seat = await Seat.findById(SeatID); // get human-readable seat number

    if (user && user.Email && seat) {
      await sendBookingEmail({
        to: user.Email,
        subject: "🎉 Seat Booking Confirmation",
        text: `Hi ${user.Name}, your seat ${seat.SeatNumber} is successfully booked for ${Date}.`,
        html: `
          <h1>Hi ${user.Name},</h1>
          <p>Your seat <strong>${seat.SeatNumber}</strong> has been successfully booked for <strong>${Date}</strong>.</p>
          <p>Time Slot: <strong>${TimeSlot}</strong></p>
          <p>Thank you for booking with SLT Mobitel!</p>
        `,
      });
    }

    res.status(201).json({
      message: "Reservation created",
      ReservationID: reservation._id,
      ReadableID: reservation.ReadableID,
      InternID,
      SeatID: reservation.SeatID,
      Date: reservation.Date,
      TimeSlot: reservation.TimeSlot,
      Status: reservation.Status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Cancel reservation (user)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    if (reservation.InternID.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    reservation.Status = "Cancelled";
    await reservation.save();

    await Seat.findByIdAndUpdate(reservation.SeatID, { Status: "Available" });

    res.json({
      message: "Reservation cancelled",
      ReservationID: reservation._id,
      ReadableID: reservation.ReadableID,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get booked seats for a specific date
router.get("/booked-seats/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const reservations = await Reservation.find({ Date: date, Status: "Active" })
      .populate("SeatID")
      .populate("InternID", "userId");

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin - View all reservations (filter by date or intern.userId)
router.get("/admin", async (req, res) => {
  try {
    const { date, intern } = req.query;
    let query = {};
    if (date) query.Date = date;

    let reservations = await Reservation.find(query)
      .populate("SeatID")
      .populate({
        path: "InternID",
        select: "userId",
        match: intern ? { userId: new RegExp(intern, "i") } : {},
      });

    // remove reservations where InternID didn’t match
    reservations = reservations.filter((r) => r.InternID);

    res.json(
      reservations.map((r) => ({
        ReservationID: r._id,
        ReadableID: r.ReadableID,
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

export default router;
