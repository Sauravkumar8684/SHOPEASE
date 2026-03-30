import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    // ✅ User reference with required validation
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
          min: [1, "Quantity atleast 1 is required ❌"],
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Unique index to ensure one cart per user
cartSchema.index({ user: 1 }, { unique: true });

export default model("Cart", cartSchema);
