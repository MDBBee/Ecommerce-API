const customError = require("../errors");
const { isTokenValid } = require("../utils");

//Authorizing all logged in users
const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token)
    throw new customError.UnauthenticatedError(
      "Not authorized, invalid token!!"
    );

  try {
    const { userId, name, role } = isTokenValid(token);
    req.user = { userId, name, role };
    next();
  } catch (error) {
    throw new customError.UnauthenticatedError(
      "Not authorized, invalid token!!"
    );
  }
};

//Authorize admin user(s) only
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new customError.UnauthorizedError(
        `Not authorized to access this resource, ${roles.join("")} only!!!`
      );
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
