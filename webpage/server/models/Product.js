import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    priceUSD: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    sku: { type: String, default: "", index: true },
    category: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
