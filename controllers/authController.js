const authService = require("../services/authService");
const { errorResponse, successResponse } = require("../utils/responseHandler");

const authController = {
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const { user, accessToken, refreshToken } = await authService.loginUser({ email, password });

      return successResponse(res, 200, "Login successful", {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      });

    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
    }
  },

  logoutUser: async (req, res) => {
    try {
      const userId = req.user.id;

      await authService.logoutUser(userId);
      return successResponse(res, 200, "Logout successful");
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      console.log("Received refresh token:", refreshToken);

      const { accessToken, refreshToken: newRefreshToken } =
        await authService.refreshAccessToken(refreshToken);
      console.log("New tokens generated:", { accessToken, newRefreshToken });

      return successResponse(res, 200, "Token updated successfully", {
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.log("Error while refreshing token:", error);
      return errorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return successResponse(res, 200, "Check your email to reset your password", result);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);
      return successResponse(res, 200, "Password reset successfully", result);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
    }
  },

  changePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      const result = await authService.changePassword(userId, currentPassword, newPassword);

      return successResponse(res, 200, "Password changed successfully", result);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
    }
  },

};

module.exports = authController;
