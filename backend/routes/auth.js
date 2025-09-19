import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { userId, Name, Email, Password, Role } = req.body;

    const existingUser = await User.findOne({ $or: [{ Email }, { userId }] });
    if (existingUser) return res.status(400).json({ msg: "Email or User ID already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const newUser = new User({ userId, Name, Email, Password: hashedPassword, Role });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully", ID: newUser.userId });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await User.findOne({ Email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        ID: user.userId,   // alias for requirement
        Name: user.Name,
        Email: user.Email,
        Role: user.Role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;