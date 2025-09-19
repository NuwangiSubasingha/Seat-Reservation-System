// import mongoose from "mongoose";

// const reservationSchema = new mongoose.Schema({
//   reservationId: { type: String, required: true, unique: true },
//   InternID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   SeatID: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true },
//   Date: { type: String, required: true }, // YYYY-MM-DD
//   TimeSlot: { type: String, required: true }, // e.g. "09:00-12:00"
//   Status: { type: String, enum: ["Active", "Cancelled"], default: "Active" }
// }, { timestamps: true });

// export default mongoose.model("Reservation", reservationSchema, "Reservations");

// import mongoose from "mongoose";

// const reservationSchema = new mongoose.Schema({
//   reservationId: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     default: () => new mongoose.Types.ObjectId().toString() 
//   },
//   InternID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   SeatID: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true },
//   Date: { type: String, required: true }, // YYYY-MM-DD
//   TimeSlot: { type: String, required: true }, 
//   Status: { type: String, enum: ["Active", "Cancelled"], default: "Active" }
// }, { timestamps: true });

// export default mongoose.model("Reservation", reservationSchema, "Reservations");


import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  reservationId: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => new mongoose.Types.ObjectId().toString() 
  },
  InternID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  SeatID: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true },
  Date: { type: String, required: true }, // YYYY-MM-DD
  TimeSlot: { type: String, default: "08:30-16:30" }, // fixed timeslot
  Status: { type: String, enum: ["Active", "Cancelled"], default: "Active" },
  
  // ✅ New human-readable reservation ID
  ReadableID: { type: String, unique: true }
}, { timestamps: true });

// ✅ Pre-save hook to generate ReadableID
reservationSchema.pre("save", async function(next) {
  if (!this.ReadableID) {
    const count = await mongoose.model("Reservation").countDocuments();
    this.ReadableID = `RES-${(count + 1).toString().padStart(4, "0")}`;
  }
  next();
});

export default mongoose.model("Reservation", reservationSchema, "Reservations");
