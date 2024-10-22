const jwt = require("jsonwebtoken");

const createJWT = function ({ payload }) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const isTokenValid = function ({ token }) {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createJWT, isTokenValid };
