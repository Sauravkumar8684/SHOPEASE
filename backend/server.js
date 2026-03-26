import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connect } from "mongoose";

// Routes Import 
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopease";

connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("DB Connection Error :", err.message);
    process.exit(1); 
  });

// Routes Configuration
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);


// Home Route (Checking purposes)
app.get("/", (req, res) => {
  res.send("ShopEase API is running smoothly...");
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});




