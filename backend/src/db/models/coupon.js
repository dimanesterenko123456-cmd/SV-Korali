import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    discountAmount: {
      type: Number,
      default: 10,
      immutable: true,
    },
    currency: {
      type: String,
      default: 'CAD',
      immutable: true,
    },
    redemptionType: {
      type: String,
      enum: ['in-store'],
      default: 'in-store',
      immutable: true,
    },
    status: {
      type: String,
      enum: ['active', 'redeemed'],
      default: 'active',
      index: true,
    },
    redeemedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CouponsCollection = mongoose.model('coupons', couponSchema);
