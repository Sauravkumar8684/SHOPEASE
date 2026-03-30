import { Router } from "express";
import { isValidObjectId } from "mongoose";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import { isAuthenticatedUser } from "../middleware/authMiddleware.js";

const router = Router();


const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    if (item.product) {
      return total + item.product.price * item.quantity;
    }
    return total;
  }, 0);
};

// ===============================
//  ADD TO CART
// ===============================
router.post("/add", isAuthenticatedUser, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // ✅ ID validate karo
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, msg: "Invalid product ID ❌" });
    }

    // ✅ Quantity positive 
    if (quantity < 1) {
      return res.status(400).json({ success: false, msg: "Quantity at least one  ❌" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found ❌" });
    }

    // ✅ Stock check
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        msg: `Sirf ${product.stock} items available  ❌`
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          msg: `Cart  already ${existingItem.quantity} hai. Sirf ${product.stock} available  ❌`
        });
      }
      existingItem.quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    
    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json({
      success: true,
      msg: "Product cart  add  ✅",
      items: updatedCart.items,
      total: calculateTotal(updatedCart.items),
    });

  } catch (err) {
    console.error("ADD TO CART ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  GET CART
// ===============================
router.get("/", isAuthenticatedUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.json({ success: true, items: [], total: 0 });
    }

    
    const validItems = cart.items.filter(item => item.product !== null);

    res.json({
      success: true,
      items: validItems,
      total: calculateTotal(validItems),
    });

  } catch (err) {
    console.error("GET CART ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  UPDATE QUANTITY 
// ===============================
router.put("/update/:productId", isAuthenticatedUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, msg: "Invalid product ID ❌" });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, msg: "Valid quantity required ❌" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found ❌" });
    }

    // ✅ Stock check
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        msg: `Sirf ${product.stock} items available  ❌`
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, msg: "Cart not found ❌" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ success: false, msg: "Product cart not found ❌" });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json({
      success: true,
      msg: "Quantity updated ✅",
      items: updatedCart.items,
      total: calculateTotal(updatedCart.items),
    });

  } catch (err) {
    console.error("UPDATE CART ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  REMOVE ITEM FROM CART
// ===============================
router.delete("/remove/:productId", isAuthenticatedUser, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, msg: "Invalid product ID ❌" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, msg: "Cart not found ❌" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, msg: "Product cart is not found ❌" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json({
      success: true,
      msg: "Product cart remove ✅",
      items: updatedCart.items,
      total: calculateTotal(updatedCart.items),
    });

  } catch (err) {
    console.error("REMOVE CART ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  CLEAR CART  
// ===============================
router.delete("/clear", isAuthenticatedUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ success: false, msg: "Cart not found ❌" });
    }

    cart.items = [];
    await cart.save();

    res.json({ success: true, msg: "Cart clear  ✅" });

  } catch (err) {
    console.error("CLEAR CART ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

export default router;