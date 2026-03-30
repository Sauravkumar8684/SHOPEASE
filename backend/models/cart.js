import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    // ✅ String se ObjectId — CRITICAL FIX
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required ❌"],
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required ❌"],
        },
        quantity: {
          type: Number,
          default: 1,
          // ✅ Quantity 0 ya negative nahi honi chahiye
          min: [1, "Quantity atleast 1 honi chahiye ❌"],
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Ek user ka sirf ek cart hoga
cartSchema.index({ user: 1 }, { unique: true });

export default model("Cart", cartSchema);
