const authService = require("../services/authService");
const { errorResponse, successResponse } = require("../utils/responseHandler");

const authController = {
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const { user, accessToken, refreshToken } = await authService.loginUser({ email, password });

      return successResponse(res, 200, "Login berhasil", {
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
        error.statusCode || 500,
        error.message || "Internal Server Error"
      );
    }
  },

  logoutUser: async (req, res) => {
    try {
      const userId = req.user.id;

      const result = await authService.logoutUser(userId);
      return successResponse(res, 200, "Logout berhasil", result);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message);
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      const { accessToken, refreshToken: newRefreshToken } =
        await authService.refreshAccessToken(refreshToken);

      return successResponse(res, 200, "Token berhasil diperbarui", {
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return errorResponse(res, error.statusCode || 403, error.message);
    }
  },
};

module.exports = authController;
