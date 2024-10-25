const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide a review title!!"],
      maxLength: 100,
    },
    comment: {
      type: String,
      maxLength: [1000, "Comment shouldn't exceed 1000 words!!"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

ReviewSchema.statics.calcAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(result);

  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating) || 0,
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calcAverageRating(this.product);
});

ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.calcAverageRating(this.product);
  }
);

module.exports = mongoose.model("Review", ReviewSchema);
