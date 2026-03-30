import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required ❌"],
    },

    orderItems: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product is required ❌"],
          },
          quantity: {
            type: Number,
            required: [true, "Quantity is required ❌"],
            min: [1, "Quantity atleast 1 honi chahiye ❌"],
          },
        },
      ],
      // ✅ Empty order block
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order mein atleast 1 item hona chahiye ❌",
      },
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required ❌"],
      min: [0, "Total price 0 se kam nahi ho sakti ❌"],
    },

    status: {
      type: String,
      // ✅ Custom enum error message
      enum: {
        values: ["Pending", "Processing", "Shipped", "Delivered"],
        message: "Invalid order status ❌",
      },
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default model("Order", orderSchema);