import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  seat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Reservation", reservationSchema);
