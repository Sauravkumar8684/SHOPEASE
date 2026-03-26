import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  user: {
  type: String
},

  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]

}, { timestamps: true });

export default model("Cart", cartSchema);