import { Schema, model } from "mongoose";

const orderSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  orderItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
      
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],

  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },

  status: {
  type: String,
  enum: ["Pending", "Processing", "Shipped", "Delivered"],
  default: "Pending"
}

}, { timestamps: true });

export default model("Order", orderSchema);