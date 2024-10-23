const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide an email.."],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email...!!",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password not less than 6 characters..."],
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePW = async function (pw) {
  const samePassword = await bcrypt.compare(pw, this.password);
  return samePassword;
};

// UserSchema.methods.createJWT = async function () {
//   const token = jwt.sign(
//     { userId: this._id, name: this.name },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "2d",
//     }
//   );

//   return token;
// };

module.exports = mongoose.model("User", UserSchema);
