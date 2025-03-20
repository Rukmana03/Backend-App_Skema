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

  refreshToken: async (req, res) => {
    try {
      console.log("[DEBUG] Body Request:", req.body);
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token is required" });
      }

      console.log("[DEBUG] Refresh Token Diterima:", refreshToken);

      // ✅ Panggil fungsi refreshAccessToken dari authService
      const { accessToken } = await authService.refreshAccessToken(refreshToken);

      return res.json({ accessToken });
    } catch (error) {
      console.error("[ERROR] Gagal Refresh Token:", error.message);
      return res.status(403).json({ error: error.message });
    }
  },

};

module.exports = authController;
