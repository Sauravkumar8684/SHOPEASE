
import { Router } from "express";
const router = Router();

import Product from "../models/product.js";
import { isAdmin, isAuthenticatedUser } from "../middleware/authMiddleware.js";


// ===============================
//  GET ALL PRODUCTS
// ===============================
router.get("/", async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;

    let query = {};

    //  Search
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    //  Category
    if (category) {
      query.category = category;
    }

    //  Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let products = Product.find(query);

    //  Sorting
    if (sort === "price_asc") {
      products = products.sort({ price: 1 });
    } else if (sort === "price_desc") {
      products = products.sort({ price: -1 });
    }

    const result = await products;

    res.json(result);

  } catch (err) {
    console.log("GET PRODUCTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// GET SINGLE PRODUCT
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found " });
    }

    res.json(product);

  } catch (err) {
    console.log("GET ONE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===============================
//  ADD PRODUCT (ADMIN)
// ===============================
router.post("/add",isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, Image } = req.body;

    //  Basic validation
    if (!name || !price) {
      return res.status(400).json({ msg: "Name & Price required " });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: ImageUrl,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      msg: "Product Added Successfully ",
      product: savedProduct,
    });

  } catch (err) {
    console.log("ADD PRODUCT ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});


// ===============================
//  DELETE PRODUCT (ADMIN)
// ===============================
router.delete("/:id",isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found " });
    }

    await product.deleteOne();

    res.json({ msg: "Product Deleted Successfully " });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// ✏️ UPDATE PRODUCT (ADMIN)
// ===============================
router.put("/:id", isAuthenticatedUser, isAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found " });
    }

    res.json({
      msg: "Product Updated Successfully ",
      product: updatedProduct,
    });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;