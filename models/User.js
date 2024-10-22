const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minLength: 6,
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

module.exports = mongoose.model("User", UserSchema);
