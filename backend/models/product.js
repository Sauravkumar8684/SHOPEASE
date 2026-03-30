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
      
      min: [0, "Price cannot be negetive ❌"],
      max: [99999999, "product price max 8 digit  ❌"],
    },
    category: {
      type: String,
      required: [true, "Category is required ❌"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required ❌"],
      
      min: [0, "Stock cannot be negative ❌"],
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
