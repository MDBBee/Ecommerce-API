const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors/index");
const { createJWT, isTokenValid } = require("../utils");

const register = async (req, res) => {
  const { email, password, name } = req.body;

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const emailExists = await User.find({ email });
  if (emailExists.length !== 0)
    throw new customError.BadRequestError("Duplicate Email.. !!");

  const user = await User.create({ name, email, password, role });
  const tokenUser = { userId: user._id, name: user.name, role: user.role };
  const token = createJWT({ payload: tokenUser });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};
const login = async (req, res) => {
  res.send("login");
};
const logout = async (req, res) => {
  res.send("logout");
};

module.exports = { register, login, logout };
