const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (!user)
    throw new customError.NotFoundError(
      `No user with id: ${req.params.id} found!1`
    );
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
const updateUser = async (req, res) => {
  console.log("Yeah");

  res.send("update");
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    throw new customError.BadRequestError(
      "Please provide both the old-password and the new-password!!"
    );

  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePW(oldPassword);

  if (!isPasswordCorrect)
    throw new customError.UnauthorizedError(
      "Wrong password, please provide another"
    );

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password Changed!!" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
