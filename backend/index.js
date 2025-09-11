// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import bookingRouter from "./routes/booking.js"; // the router we created

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/bookings", bookingRouter);

// // Connect to MongoDB and start server
// const PORT = 5000;
// const MONGO_URI = "mongodb://localhost:27017/yourdb"; // change to your DB name

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
//   })
//   .catch(err => console.error("MongoDB connection error:", err));
