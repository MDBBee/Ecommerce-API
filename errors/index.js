const BadRequestError = require("./bad-request");
const UnauthenticatedError = require("./unauthenticated");
const NotFoundError = require("./not-found");
const UnauthorizedError = require("./unauthorized");
const CustomAPItError = require("./custom-api");

module.exports = {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
  CustomAPItError,
  UnauthorizedError,
};
