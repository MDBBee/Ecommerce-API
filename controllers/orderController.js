const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createOrders = async (req, res) => {
  const { tax, shippingFee, items: cartItems } = req.body;

  if (!cartItems || cartItems.length < 1)
    throw new CustomError.BadRequestError(`Please provide the cartItems`);

  if (!tax || !shippingFee)
    throw new CustomError.BadRequestError(
      `Please provide values for both the tax and shippingFee inputs`
    );

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const productDb = await Product.findOne({ _id: item.product });
    if (!productDb)
      throw new CustomError.NotFoundError(
        `No product with ID: ${item.product} was found in our database!`
      );

    const { name, price, image, _id } = productDb;

    orderItems = [
      ...orderItems,
      { amount: item.amount, name, price, image, product: _id },
    ];

    subtotal += item.amount * price;

    res.send("Created order!!");
  }
};

const getAllOrders = async (req, res) => {
  res.send("getAllOrders");
};
const getSingleOrder = async (req, res) => {
  res.send("getSingleOrder");
};
const getCurrentUserOrders = async (req, res) => {
  res.send("getCurrentUserOrders");
};
const updateOrder = async (req, res) => {
  res.send("updateOrder");
};

module.exports = {
  createOrders,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
};
