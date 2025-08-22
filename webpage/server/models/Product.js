import mongoose from 'mongoose';

export const CATEGORIES = ['motos', 'bicicletas', 'monopatines', 'accesorios'];

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    priceUSD: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String },
    description: { type: String },
    sku: { type: String, index: true, sparse: true, trim: true },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', sku: 'text' });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
