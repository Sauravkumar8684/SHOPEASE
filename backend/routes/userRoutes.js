import { Router } from "express";
import { isValidObjectId } from "mongoose";
import User from "../models/user.js";
import Order from "../models/order.js";
import { isAuthenticatedUser, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// ===============================
//  DASHBOARD STATS (ADMIN)
// ===============================
router.get("/stats", isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    // ✅ Parallel queries 
    const [totalUsers, totalOrders, revenueData, statusData] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),

      
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ]),

      
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ])
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    // Status breakdown object 
    const ordersByStatus = {};
    statusData.forEach(s => {
      ordersByStatus[s._id] = s.count;
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue,
        ordersByStatus, 
      }
    });

  } catch (err) {
    console.error("STATS ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  GET ALL USERS (ADMIN)
// ===============================
router.get("/", isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 }); 

    res.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (err) {
    console.error("GET USERS ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  UPDATE USER ROLE (ADMIN)
// ===============================
router.put("/role/:id", isAuthenticatedUser, isAdmin, async (req, res) => {
  // ✅ ID validate 
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Invalid user ID ❌" });
  }

  try {
    const { role } = req.body;

    // ✅ Role validate karo
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        msg: "Role  'user' ya 'admin'  ❌"
      });
    }

    
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        msg: "admin not change role ❌"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    // ✅ User exist 
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found ❌" });
    }

    res.json({
      success: true,
      msg: `Role "${role}" update  ✅`,
      user,
    });

  } catch (err) {
    console.error("ROLE UPDATE ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

export default router;