import { Router } from "express";
const router = Router();

import Cart from "../models/cart.js";
import Product from "../models/product.js";
import { isAuthenticatedUser } from "../middleware/authMiddleware.js";


// ===============================
//  ADD PRODUCT TO CART
// ===============================
router.post("/add", isAuthenticatedUser, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    //  Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found " });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    //  Create new cart if not exists
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
      });
    }

    //  Check if item already exists
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (err) {
    console.log("ADD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// 📦 GET USER CART
// ===============================
router.get("/", isAuthenticatedUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart) {
      return res.json({
        success: true,
        items: [],
        total: 0,
      });
    }

    let total = 0;

    cart.items.forEach((item) => {
      if (item.product) {
        total += item.product.price * item.quantity;
      }
    });

    res.json({
      success: true,
      items: cart.items,
      total,
    });

  } catch (err) {
    console.log("GET CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// ❌ REMOVE ITEM FROM CART
// ===============================
router.delete("/remove/:productId", isAuthenticatedUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found " });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === req.params.productId
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();

      return res.json({
        success: true,
        cart,
      });
    } else {
      return res.status(404).json({ msg: "Product not in cart " });
    }

  } catch (err) {
    console.log("REMOVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});



export default router;