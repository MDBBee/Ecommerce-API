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
      required: [true, "Please provide the product's company name!!"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not in the supported list!!",
      },
    },
    colors: {
      type: [String],
      default: ["#333"],
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
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.model("Review").deleteMany({ product: this._id });
  }
);

// { document: true, query: false } ====  this hook applies to the "document method" and not the "query"

module.exports = mongoose.model("Product", ProductSchema);
