// server/models/Order.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    priceUSD: Number,
    qty: { type: Number, min: 1 }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" }
    },
    notes: { type: String, default: "" },
    items: [OrderItemSchema],
    total: { type: Number, min: 0 },
    status: { type: String, default: "pending", enum: ["pending", "paid", "cancelled"] }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
