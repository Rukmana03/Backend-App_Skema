const { verifyToken } = require("../utils/JwtUtils");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = verifyToken(token);

  if (!decoded) return res.status(401).json({ error: "Invalid token" });

  req.user = decoded;
  next();
};

const roleMiddleware = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!requiredRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have access to this resource" });
    }

    next();
  };
};

module.exports = { authenticate, roleMiddleware };

// const authorizeAdmin = (req, res, next) => {
//   console.log("User role in middleware:", req.user?.role);
//   if (req.user.role !== "Admin") {
//     return res
//       .status(403)
//       .json({ error: "Forbidden: Only admins can access this route" });
//   }
//   next();
// };