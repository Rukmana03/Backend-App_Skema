const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");
const userRepository = require("../repositories/userRepository")
const { throwError } = require("../utils/responeHandler");
require("dotenv").config();


const loginAttempts = {};
const maxAttempts = 3;
const lockoutTime = 10 * 60 * 1000;

const generateAccessToken = (userId, email, role) => {
  return jwt.sign({ id: userId, email, role }, process.env.JWT_SECRET, {
    expiresIn: "6h",
  });
};

const generateRefreshToken = (userId, email, role,) => {
  return jwt.sign({ id: userId, email, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const authService = {
  loginUser: async ({ email, password }) => {
    if (!email || !password) {
      throwError(400, "Email and password are required");
    }

    if (!loginAttempts[email]) {
      loginAttempts[email] = { attempts: 0, lastAttempt: Date.now() };
    }

    if (loginAttempts[email].attempts >= maxAttempts) {
      const timeSinceLastAttempt = Date.now() - loginAttempts[email].lastAttempt;
      console.log(`Waktu sejak percobaan terakhir: ${timeSinceLastAttempt / 1000} detik`);

      if (timeSinceLastAttempt < lockoutTime) {
        throwError(429, "Too many login attempts. Try again later.");
      } else {
        console.log("Lockout berakhir, reset login attempts.");
        loginAttempts[email].attempts = 0;
        loginAttempts[email].lastAttempt = Date.now();
      }
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      loginAttempts[email].attempts++;
      loginAttempts[email].lastAttempt = Date.now();
      throwError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      loginAttempts[email].attempts++;
      loginAttempts[email].lastAttempt = Date.now();
      throwError(401, "Invalid email or password");
    }

    delete loginAttempts[email];

    const accessToken = generateAccessToken(user.id, user.email, user.role,);
    let refreshToken = null;

    if (user.role === "Admin") {
      refreshToken = generateRefreshToken(user.id, user.email, user.role);
      await authRepository.updateUserRefreshToken(user.id, refreshToken); // Save refresh token in DB
    }

    return { user, accessToken, refreshToken };
  },

  logoutUser: async (userId) => {
    console.log(`Menghapus refresh token untuk user ID: ${userId}`);
    const user = await userRepository.findUserById(userId);
    console.log(`Refresh token berhasil dihapus untuk user ID: ${userId}`);
    // Jika user tidak ditemukan
    if (!user) {
      throwError(404, "User not found");
    }

    // Hanya hapus refreshToken jika user adalah Admin
    if (user.role === "Admin") {
      await authRepository.updateUserRefreshToken(userId, null);
    }

    return { message: "Logout successful" };
  },

  refreshAccessToken: async (refreshToken) => {
    if (!refreshToken) {
      throwError(401, "Refresh token is required");
    }

    try {
      console.log("[DEBUG] Refresh Token Diterima:", refreshToken);
      console.log("[DEBUG] Decode Sebelum Verifikasi:", jwt.decode(refreshToken));

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      console.log("[DEBUG] Hasil Decode Setelah Verifikasi:", decoded);

      const user = await userRepository.findUserById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        await authRepository.updateUserRefreshToken(decoded.id, null);
        throwError(401, "Invalid refresh token");
      }

      // 🔹 Perbaikan: Gunakan role dari decoded jika ada
      const newAccessToken = generateAccessToken(decoded.id, decoded.email, decoded.role || user.role);
      console.log("[DEBUG] New Access Token:", newAccessToken);

      return { accessToken: newAccessToken };
    } catch (error) {
      console.error("[ERROR] Refresh token tidak valid:", error.message);
      throwError(401, "Invalid or expired refresh token");
    }
  },

};

module.exports = authService
