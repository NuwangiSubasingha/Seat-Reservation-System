import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  label: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

export default mongoose.model("Seat", seatSchema);
