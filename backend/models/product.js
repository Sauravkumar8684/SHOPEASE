import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required ❌"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required ❌"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required ❌"],
      // ✅ Min aur max dono
      min: [0, "Price 0 se kam nahi ho sakti ❌"],
      max: [99999999, "Price 8 digits se zyada nahi ho sakti ❌"],
    },
    category: {
      type: String,
      required: [true, "Category is required ❌"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required ❌"],
      // ✅ Stock negative nahi hona chahiye
      min: [0, "Stock 0 se kam nahi ho sakta ❌"],
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Image URL is required ❌"],
    },
  },
  // ✅ timestamps — createdAt aur updatedAt automatically
  { timestamps: true }
);

export default model("Product", productSchema);
