import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true }, // Internal unique ID, optional for Google users
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String }, // optional for Google login
    Role: { type: String, enum: ["Intern", "Admin", "User"], default: "Intern" },
    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema, "Users");
