const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");
const userRepository = require("../repositories/userRepository");
const { throwError } = require("../utils/responseHandler");
const { sendResetPasswordEmail } = require("../utils/emailHelper");
const { generateAccessToken, generateRefreshToken } = require("../utils/JwtUtils");
require("dotenv").config();

const loginAttempts = {};
const maxAttempts = 3;
const lockoutTime = 5 * 60 * 1000;
const maxRefreshAttempts = 3;

const authService = {
  loginUser: async ({ email, password }) => {
    if (!email || !password) {
      throwError(400, "Email and password are required");
    }
    const now = Date.now();

    // Inisialisasi percobaan login
    if (!loginAttempts[email]) {
      loginAttempts[email] = { attempts: 0, lastAttempt: now, lockedUntil: null };
    }

    const attemptData = loginAttempts[email];

    // Cek apakah user masih dalam masa kunci (locked)
    if (attemptData.lockedUntil && now < attemptData.lockedUntil) {
      const remaining = Math.ceil((attemptData.lockedUntil - now) / 1000);
      throwError(429, `Account is locked. Please try again in ${remaining} seconds`);
    }

    const user = await userRepository.findUserByEmail(email);
    const PasswordValid = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !PasswordValid) {
      attemptData.attempts += 1;
      attemptData.lastAttempt = now;

      if (attemptData.attempts >= maxAttempts) {
        attemptData.lockedUntil = now + lockoutTime;
        throwError(429, "Too many login attempts. Please try again in 5 minutes");
      }

      throwError(401, "Incorrect email or password");
    }
    // Jika login berhasil DAN tidak sedang terkunci → reset
    if (!attemptData.lockedUntil || now >= attemptData.lockedUntil) {
      delete loginAttempts[email];
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await authRepository.updateRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  },

  refreshAccessToken: async (oldRefreshToken) => {
    if (!oldRefreshToken) {
      throwError(401, "Refresh token required");
    }

    let decoded;
    try {
      console.log("Verifying token:", oldRefreshToken);
      decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      console.log("Token verification failed:", error.message);
      throwError(401, "Refresh token is invalid or expired");
    }

    const user = await userRepository.findUserById(decoded.id);
    if (!user || user.refreshToken !== oldRefreshToken) {
      // Jika token tidak cocok, hapus dari DB untuk keamanan
      await authRepository.updateRefreshToken(decoded.id, null);
      throwError(401, "Refresh token is invalid");
    }

    if (user.refreshAttempts >= maxRefreshAttempts) {
      await authRepository.updateRefreshToken(user.id, null);
      await userRepository.resetRefreshAttempts(user.id);
      throwError(401, "Refresh token limit reached. Please login again");
    }

    // 🔄 ROTASI TOKEN: buat token baru
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Simpan refresh token baru (ganti yang lama)
    await authRepository.updateRefreshToken(user.id, newRefreshToken);
    await userRepository.incrementRefreshAttempts(user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, 
    };
  },

  logoutUser: async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throwError(404, "User not found");
    }
    await authRepository.updateRefreshToken(userId, null);
    return user;
  },

  forgotPassword: async (email) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) throwError(404, "Email not found");

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "15m" }
    );

    await sendResetPasswordEmail(email, token);
    return;
  },

  resetPassword: async (token, newPassword) => {
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_RESET_SECRET);
    } catch (err) {
      throwError(400, "Token is invalid or expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authRepository.updateUserPassword(payload.id, hashedPassword);
    return;
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
      throwError(400, "Both old and new passwords must be filled in");
    }
    const user = await userRepository.findUserById(userId);
    console.log("user:", user);
    console.log("user.password:", user.password);
    if (!user) {
      throwError(404, "User not found");
    }

    if (!user.password) {
      throwError(400, "Password has not been set. Please reset the password first");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throwError(400, "The old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authRepository.updateUserPassword(userId, hashedPassword);

    return;
  },

};

module.exports = authService;
