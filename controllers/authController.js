const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors/index");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email, password, name } = req.body;

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const emailExists = await User.find({ email });
  if (emailExists.length !== 0)
    throw new customError.BadRequestError("Duplicate Email.. !!");

  const user = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new customError.BadRequestError(
      "Please provide both email and password!!"
    );

  const user = await User.findOne({ email });
  if (!user) throw new customError.UnauthenticatedError("Invalid credentials");

  const isPasswordCorrect = await user.comparePW(password);
  if (!isPasswordCorrect)
    throw new customError.UnauthenticatedError("Invalid credentials");

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).send("Logged out user");
};

module.exports = { register, login, logout };
