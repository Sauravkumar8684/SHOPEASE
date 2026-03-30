import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ===============================
//  REGISTER
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Basic validation
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        msg: "every fields required  ❌"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        msg: "Password must be at least six characters long ❌"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: " email already registered  ❌"
      });
    }

    // ✅ Role is hardcoded to "user" — never trust client input for this
    const newUser = await User.create({
      name,
      email,
      password,
      phoneNumber,
      role: "user", 
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      msg: "Registration successful ✅",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error, try again later"
    });
  }
});


// ===============================
//  LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password  required  ❌"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    // ✅ Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password ❌"
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      msg: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error, try again later"
    });
  }
});

export default router;