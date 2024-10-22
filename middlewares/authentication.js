const { UnauthenticatedError } = require("../errors/index");
const jwt = require("jsonwebtoken");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new UnauthenticatedError(
      "Either no token or an invalid token received!!"
    );

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this resource!");
  }
};

module.exports = authenticationMiddleware;
