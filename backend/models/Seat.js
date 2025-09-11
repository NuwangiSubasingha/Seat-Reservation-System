// import mongoose from "mongoose";

// const seatSchema = new mongoose.Schema({
//   seatId: { type: String, required: true, unique: true },
//   SeatNumber: { type: String, required: true },
//   Location: { type: String, required: true },
//   Status: { type: String, enum: ["Available", "Unavailable"], default: "Available" }
// }, { timestamps: true });

// export default mongoose.model("Seat", seatSchema, "Seats");

import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatId: { type: String, required: true, unique: true },
  SeatNumber: { type: String, required: true },
  Location: { type: String, required: true, default: "Default Location" },
  Status: { type: String, enum: ["Available", "Unavailable"], default: "Available" }
}, { timestamps: true });

export default mongoose.model("Seat", seatSchema, "Seats");

