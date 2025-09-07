import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // User enters this
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Intern", "Admin"], default: "Intern" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);


