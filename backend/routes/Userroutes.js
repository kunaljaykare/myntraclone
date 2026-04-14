const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

//SIGNUP
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existinguser = await User.findOne({ email });

    if (existinguser)
      return res.status(400).json({ message: "User already exists" });

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedpassword,
    });

    await user.save();

    const { password: _, ...userData } = user.toObject();

    res.status(201).json({ user: userData });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// ✅ LOGIN (WITH JWT)
router.post("/login", async (req, res) => {
  console.log("BODY:", req.body);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("USER:", user);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const ismatch = await bcrypt.compare(password, user.password);
    console.log("MATCH:", ismatch);

    if (!ismatch)
      return res.status(401).json({ message: "Invalid password" });

    console.log("JWT SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({ success: true, token });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;