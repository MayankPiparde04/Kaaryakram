import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  name: String,
  image: String,
  category: String,
});

const cartSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    index: true, // Add index for faster queries
  },
  items: {
    type: [cartItemSchema], // Explicitly define as array of cartItemSchema
    default: [],
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  promoCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamps before saving
cartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Use findOne and create it if it doesn't exist
export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
