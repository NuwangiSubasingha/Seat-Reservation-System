import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Internal unique ID
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Role: { type: String, enum: ["Intern", "Admin"], default: "Intern" }
}, { timestamps: true });

export default mongoose.model("User", userSchema, "Users");
