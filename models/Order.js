const mongoose = require("mongoose");

const SingleCartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amout: { type: Number, required: true },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
    },
    shippingFee: {
      type: Number,
    },
    subtotal: {
      type: Number,
    },
    total: {
      type: Number,
    },
    cartItems: [SingleCartItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
