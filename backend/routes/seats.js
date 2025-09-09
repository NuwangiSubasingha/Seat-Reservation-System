import express from "express";
import Seat from "../models/Seat.js";

const router = express.Router();

// GET all seats
router.get("/", async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD a new seat
router.post("/", async (req, res) => {
  const { label } = req.body;
  try {
    const newSeat = new Seat({ label });
    await newSeat.save();
    res.json(newSeat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a seat
router.delete("/:id", async (req, res) => {
  try {
    const removedSeat = await Seat.findByIdAndDelete(req.params.id);
    res.json(removedSeat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
