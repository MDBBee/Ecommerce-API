const customError = require("../errors");

const checkPermissions = (requestedUser, resourceUserId) => {
  if (
    requestedUser.role === "admin" ||
    resourceUserId.toString() === requestedUser.userId
  )
    return;
  else
    throw new customError.UnauthorizedError(
      `You are not allowed access to another users' details!!... `
    );
};

module.exports = checkPermissions;
