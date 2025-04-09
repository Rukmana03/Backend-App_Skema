const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");
const userRepository = require("../repositories/userRepository");
const { throwError } = require("../utils/responseHandler");
require("dotenv").config();

const loginAttempts = {};
const maxAttempts = 3;
const lockoutTime = 10 * 60 * 1000; // 10 menit

const generateAccessToken = (userId, email, role) => {
  return jwt.sign({ id: userId, email, role }, process.env.JWT_SECRET, {
    expiresIn: "6h",
  });
};

const generateRefreshToken = (userId, email, role) => {
  return jwt.sign({ id: userId, email, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const authService = {
  loginUser: async ({ email, password }) => {
    if (!email || !password) {
      throwError(400, "Email dan password wajib diisi");
    }

    // Inisialisasi percobaan login
    if (!loginAttempts[email]) {
      loginAttempts[email] = { attempts: 0, lastAttempt: Date.now() };
    }

    // Cek apakah user terkunci karena terlalu banyak percobaan
    if (loginAttempts[email].attempts >= maxAttempts) {
      const timeSinceLastAttempt = Date.now() - loginAttempts[email].lastAttempt;

      if (timeSinceLastAttempt < lockoutTime) {
        throwError(429, "Terlalu banyak percobaan login. Coba lagi nanti.");
      } else {
        // Reset jika sudah lewat waktu kunci
        loginAttempts[email].attempts = 0;
        loginAttempts[email].lastAttempt = Date.now();
      }
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      loginAttempts[email].attempts++;
      loginAttempts[email].lastAttempt = Date.now();
      throwError(401, "Email atau password salah");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      loginAttempts[email].attempts++;
      loginAttempts[email].lastAttempt = Date.now();
      throwError(401, "Email atau password salah");
    }

    // Reset login attempt jika berhasil
    delete loginAttempts[email];

    const accessToken = generateAccessToken(user.id, user.email, user.role);
    let refreshToken = null;

    if (user.role === "Admin") {
      refreshToken = generateRefreshToken(user.id, user.email, user.role);
      await authRepository.updateRefreshToken(user.id, refreshToken);
    }

    return { user, accessToken, refreshToken };
  },

  logoutUser: async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throwError(404, "User tidak ditemukan");
    }

    if (user.role === "Admin") {
      await authRepository.updateRefreshToken(userId, null);
    }

    return user;
  },

  refreshAccessToken: async (oldRefreshToken) => {
    if (!oldRefreshToken) {
      throwError(401, "Refresh token diperlukan");
    }

    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throwError(401, "Refresh token tidak valid atau kadaluarsa");
    }

    const user = await userRepository.findUserById(decoded.id);
    if (!user || user.refreshToken !== oldRefreshToken) {
      // Jika token tidak cocok, hapus dari DB untuk keamanan
      await authRepository.updateRefreshToken(decoded.id, null);
      throwError(401, "Refresh token tidak valid");
    }

    // 🔄 ROTASI TOKEN: buat token baru
    const newAccessToken = generateAccessToken(user.id, user.email, user.role);
    const newRefreshToken = generateRefreshToken(user.id, user.email, user.role);

    // Simpan refresh token baru (ganti yang lama)
    await authRepository.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // kirim ini ke frontend
    };
  },
};

module.exports = authService;
