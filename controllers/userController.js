const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  checkPermissions(req.user, user._id);

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
  const { name, email } = req.body;

  if (!name || !email)
    throw new customError.BadRequestError(
      "Please provide both the old-password and the new-password!!"
    );

  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
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

// Using findOneAndUpdate Method....
// const updateUser = async (req, res) => {
//     const { name, email } = req.body;

//     if (!name || !email)
//       throw new customError.BadRequestError(
//         "Please provide both the old-password and the new-password!!"
//       );

//     const user = await User.findOneAndUpdate(
//       { _id: req.user.userId },
//       { email, name },
//       { new: true, runValidators: true }
//     );

//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({ res, user: tokenUser });
//     res.status(StatusCodes.OK).json({ user: tokenUser });
//   };
