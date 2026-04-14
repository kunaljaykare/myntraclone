const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Basic validation check
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashed,
    });

    res.status(201).json({ success: true, message: "User created" });
  } catch (error) {
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Generic error message for security
    const authError = "Invalid email or password";

    if (!user) return res.status(401).json({ message: authError });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: authError });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// ================= PROFILE =================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Assuming authMiddleware attaches the user to req.user
    // and you've already stripped the password there.
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch profile" });
  }
});

module.exports = router;