const { UnauthenticatedError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong !!!",
  };

  //Other conditions based on databaseErrors or other errors not coming from the controllers

  res.status(customError.status).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
