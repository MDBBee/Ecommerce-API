const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { findOneAndUpdate } = require("../models/User");
const createReview = async (req, res) => {
  const { product: productId } = req.body;

  //Check if selected product is valid
  const prod = await Product.findOne({ _id: productId });
  if (!prod)
    throw new CustomError.BadRequestError(`No product with id: ${productId}`);

  //check if a review has previously been submitted for this product by this user
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadyReviewed)
    throw new CustomError.BadRequestError(
      `Product has already been reviewed. You can only either delete or update/change your review.}`
    );

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review)
    throw new CustomError.BadRequestError(`No review with the id: ${reviewId}`);

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  //Check if review exists!!
  const review = await Review.findOne({ _id: reviewId });
  if (!review)
    throw new CustomError.BadRequestError(`No review with the id: ${reviewId}`);

  //Check if the current user is the owner of the review
  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  //Check if review exists!!
  const review = await Review.findOne({ _id: reviewId });
  if (!review)
    throw new CustomError.BadRequestError(`No review with the id: ${reviewId}`);

  //Check if the current user is the owner of the review
  checkPermissions(req.user, review.user);

  await review.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Review successfully deleted!" });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
