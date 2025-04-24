const { verifyToken } = require("../utils/JwtUtils");
const { errorResponse } = require("../utils/responseHandler");
const { message } = require("../validations/profileValidaton");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Invalid, Token not found");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, 401, "Invalid, Token is invalid or expired");
    }

    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error, message || "Internal Server Error");
  }

};

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 401, "Invalid, Must login first");
      }

      if (!allowedRoles.includes(req.user.role)) {
        return errorResponse(res, 403, `Forbidden, You are not authorized. Only ${allowedRoles.join(", ")} can access this resource.`);
      }

      next();
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error, message || "Internal Server Error");
    }
  };
};

module.exports = { authenticate, roleMiddleware };

