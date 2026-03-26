import { Router } from "express";
const router = Router();

import User from "../models/user.js";
import { isAuthenticatedUser, isAdmin } from "../middleware/authMiddleware.js";
import Order from "../models/order.js";


// ===============================
//  DASHBOARD STATS (ADMIN)
// ===============================
router.get("/stats", isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ===============================
// 📦 GET ALL USERS (ADMIN)
// ===============================
router.get("/", isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// 🔄 UPDATE ROLE
// ===============================

router.put("/role/:id", isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role type" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password"); 

    res.json({ msg: "Role updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;