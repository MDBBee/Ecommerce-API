const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide the product's name!!"],
      maxLength: [100, "Name cannot be more than 100 characters!!"],
    },
    price: {
      type: Number,
      required: [true, "Please provide the product's price!!"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide the product's description!!"],
      maxLength: [1000, "Name cannot be more than 1000 characters!!"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please provide the product's category!!"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please provide the product's category!!"],
      enum: {
        values: ["office", "kitchen", "bedroom"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
