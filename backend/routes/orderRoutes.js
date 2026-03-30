import { Router } from "express";
import { isValidObjectId } from "mongoose";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAuthenticatedUser, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

const VALID_STATUSES = ["Pending", "Processing", "Shipped", "Delivered"];

// ===============================
//  CHECKOUT (CREATE ORDER)
// ===============================
router.post("/checkout", isAuthenticatedUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Cart empty ❌"
      });
    }

    // ✅ Deleted products filter and stock check
    const validItems = cart.items.filter(item => item.product !== null);

    if (validItems.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Cart no valid product ❌"
      });
    }

    
    for (const item of validItems) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          msg: `"${item.product.name}" ka sirf ${item.product.stock} stock available  ❌`
        });
      }
    }

    // ✅ Total calculate
    const total = validItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // ✅ Order created
    const order = await Order.create({
      user: userId,
      orderItems: validItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice: total,
      status: "Pending",
    });

    // ✅ Stock updated
    for (const item of validItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // ✅ Cart clear 
    cart.items = [];
    await cart.save();

    
    const populatedOrder = await Order.findById(order._id)
      .populate("orderItems.product", "name price image");

    res.status(201).json({
      success: true,
      msg: "Order placed ✅",
      order: populatedOrder,
    });

  } catch (err) {
    console.error("CHECKOUT ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  GET USER ORDERS
// ===============================
router.get("/", isAuthenticatedUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("orderItems.product", "name price image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (err) {
    console.error("GET ORDERS ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  ADMIN: GET ALL ORDERS

// ===============================
router.get("/all", isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price image")
      .sort({ createdAt: -1 }); 

  
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    res.json({
      success: true,
      count: orders.length,
      totalRevenue,
      orders,
    });

  } catch (err) {
    console.error("ADMIN GET ORDERS ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  GET SINGLE ORDER
// ===============================
router.get("/:id", isAuthenticatedUser, async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Invalid order ID ❌" });
  }

  try {
    const order = await Order.findById(req.params.id)
      .populate("orderItems.product", "name price image");

    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found ❌" });
    }

    
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, msg: "Access denied ❌" });
    }

    res.json({ success: true, order });

  } catch (err) {
    console.error("GET ORDER ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  ADMIN: UPDATE ORDER STATUS
// ===============================
router.put("/:id/status", isAuthenticatedUser, isAdmin, async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Invalid order ID ❌" });
  }

  try {
    const { status } = req.body;

    // ✅ Status validation
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        msg: `Valid status chahiye: ${VALID_STATUSES.join(", ")} ❌`
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found ❌" });
    }

    // ✅ Delivered order not be updated
    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        msg: "Delivered order not be change ❌"
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      msg: `Status "${status}" updated ✅`,
      order,
    });

  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

export default router;