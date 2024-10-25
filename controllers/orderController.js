const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { findOne } = require("../models/Review");

const someFakeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

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
  }
  const total = tax + shippingFee + subtotal;

  const paymentIntent = await someFakeAPI({ amount: total, currency: "usd" });

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    user: req.user.userId,
    clientSecret: paymentIntent.client_secret,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate({
    path: "user",
    select: "name",
  });

  if (!orders)
    throw new CustomError.NotFoundError(
      `Order list/collection is empty at the moment!!..`
    );

  res.status(StatusCodes.OK).json({ noHits: orders.length, orders });
};
const getSingleOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });

  if (!order)
    throw new CustomError.NotFoundError(
      `Order with ID: ${req.params.id} isn't in our database!!`
    );
  checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });

  if (!orders)
    throw new CustomError.NotFoundError(
      `No Order found for user with ID: ${req.user.userId}!!`
    );

  res.status(StatusCodes.OK).json({ orders });
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });

  if (!order)
    throw new CustomError.NotFoundError(
      `Order with ID: ${req.params.id} isn't in our database!!`
    );
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  createOrders,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
};
