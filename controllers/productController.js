const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ count: products.length, products });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate("reviews");

  if (!product)
    throw new customError.BadRequestError(
      `No product with the id: ${productId}`
    );

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product)
    throw new customError.BadRequestError(
      `No product with the id: ${productId}`
    );

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product)
    throw new customError.BadRequestError(
      `No product with the id: ${productId}`
    );

  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Sucess! Product Removed" });
};

const uploadImage = async (req, res) => {
  if (!req.files)
    throw new customError.BadRequestError("Please select an image file!!..");

  if (!req.files.image.mimetype.startsWith("image/"))
    throw new customError.BadRequestError("Only image files accepeted!!..");

  const maxSize = 1048576;
  if (req.files.image.size > maxSize)
    throw new customError.BadRequestError("File size is too big!!..");

  const uploadedImage = req.files.image;

  const imagePath = path.join(
    __dirname,
    `../public/uploads/${uploadedImage.name}`
  );

  await uploadedImage.mv(imagePath);

  res
    .status(StatusCodes.CREATED)
    .json({ image: `/uploads/${uploadedImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
