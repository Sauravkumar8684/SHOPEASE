import { Router } from "express";
const router = Router();

import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// ===============================
//  REGISTER
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists ❌" });
    }
  
    const newUser = new User({
      name,
      email,
      password,
      phoneNumber,
      role: role || "user",
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "User registered successfully ",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
      },
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===============================
//  LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ msg: "Invalid Email " });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password " });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful ",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;