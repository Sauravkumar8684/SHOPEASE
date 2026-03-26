import { Router } from "express";
const router = Router();

import Cart from "../models/cart.js";
import Order from "../models/order.js";
import { isAuthenticatedUser, isAdmin } from "../middleware/authMiddleware.js";


// ===============================
//  CHECKOUT (CREATE ORDER)
// ===============================
router.post("/checkout", isAuthenticatedUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ msg: "Cart is empty " });
    }

    let total = 0;

    cart.items.forEach((item) => {
      if (item.product) {
        total += item.product.price * item.quantity;
      }
    });

    const order = new Order({
      user: userId,
      orderItems: cart.items,
      totalPrice: total,
      status: "Pending",
    });

    await order.save();

    // 🧹 Clear cart
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      msg: "Order placed successfully ",
      order,
    });

  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===============================
//  GET USER ORDERS
// ===============================
router.get("/", isAuthenticatedUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("orderItems.product");

    res.json({
      success: true,
      orders,
    });

  } catch (err) {
    console.log("GET ORDERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===============================
//  ADMIN: GET ALL ORDERS
// ===============================
router.get("/all", isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product");

    res.json({
      success: true,
      orders,
    });

  } catch (err) {
    console.log("ADMIN GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===============================
//  ADMIN: UPDATE ORDER STATUS
// ===============================
router.put("/:id/status", isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found " });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      msg: "Status updated ",
      order,
    });

  } catch (err) {
    console.log("STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;