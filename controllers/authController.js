const authService = require("../services/authService");
const { errorResponse, successResponse } = require("../utils/responeHandler");
const authRepository = require("../repositories/authRepository")

const authController = {
loginUser: async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.loginUser({ email, password });
    console.log("Generated Access Token:", accessToken);

    return successResponse(res, 200, "Login successfull", {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    return errorResponse(
      res,
      error.status || 500,
      error.message || "Internal Server Error"
    );
  }
},

logoutUser: async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await authService.logoutUser(userId);

    await authRepository.deleteRefreshToken(userId);
    console.log(`Refresh token has been cleared for user ID: ${userId}`);

    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
},

refreshToken: (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  // Decode and verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    return res.status(403).json({ error: "Forbidden: Invalid refresh token" });
  }

  // Ensure that only admin can refresh the token
  if (decoded.role !== 'Admin') {
    return res.status(403).json({ error: "Forbidden: Only admin can refresh token" });
  }

  const newAccessToken = generateAccessToken(decoded.id, decoded.role);

  res.json({ accessToken: newAccessToken });
},

};

module.exports = authController;
