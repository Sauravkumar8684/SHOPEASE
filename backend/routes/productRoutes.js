import { Router } from "express";
import { isValidObjectId } from "mongoose";
import Product from "../models/product.js";
import { isAdmin, isAuthenticatedUser } from "../middleware/authMiddleware.js";

const router = Router();

// ID validate karne ka helper
const validateId = (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, msg: "Invalid product ID ❌" });
    return false;
  }
  return true;
};

// ===============================
//  GET ALL PRODUCTS
// ===============================
router.get("/", async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;

    let query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let dbQuery = Product.find(query);

    if (sort === "price_asc") dbQuery = dbQuery.sort({ price: 1 });
    else if (sort === "price_desc") dbQuery = dbQuery.sort({ price: -1 });
    else dbQuery = dbQuery.sort({ createdAt: -1 }); // ✅ default: newest first

    const products = await dbQuery;

    res.json({
      success: true,
      count: products.length,
      products,
    });

  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  GET SINGLE PRODUCT
// ===============================
router.get("/:id", async (req, res) => {
  if (!validateId(req, res)) return; // ✅ ID check

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found ❌" });
    }

    res.json({ success: true, product });

  } catch (err) {
    console.error("GET ONE ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  ADD PRODUCT (ADMIN)
// ===============================
router.post("/add", isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    // ✅ Sab required fields validate karo
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({
        success: false,
        msg: "Name, description, price, category aur image required hain ❌"
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 1,
      image,
    });

    res.status(201).json({
      success: true,
      msg: "Product added successfully ✅",
      product,
    });

  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err.message);
    res.status(400).json({ success: false, msg: err.message });
  }
});

// ===============================
//  UPDATE PRODUCT (ADMIN)
// ===============================
router.put("/:id", isAuthenticatedUser, isAdmin, async (req, res) => {
  if (!validateId(req, res)) return; // ✅ ID check

  try {
    // ✅ Sirf allowed fields — req.body directly nahi
    const { name, description, price, category, stock, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, image },
      { new: true, runValidators: true } // ✅ schema validators chalenge
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, msg: "Product not found ❌" });
    }

    res.json({
      success: true,
      msg: "Product updated successfully ✅",
      product: updatedProduct,
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================
//  DELETE PRODUCT (ADMIN)
// ===============================
router.delete("/:id", isAuthenticatedUser, isAdmin, async (req, res) => {
  if (!validateId(req, res)) return; // ✅ ID check

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found ❌" });
    }

    await product.deleteOne();

    res.json({ success: true, msg: "Product deleted successfully ✅" });

  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

export default router;