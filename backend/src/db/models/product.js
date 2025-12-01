import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: String },
    inStock: { type: Boolean, default: true },
    countInStock: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const ProductCollection = mongoose.model('Product', productSchema);
