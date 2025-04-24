const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authRepository = {
  findUserByEmail: (email) =>
    prisma.user.findUnique({
      where: { email },
    }),

  updateRefreshToken: (userId, token) =>
    prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    }),

  updateUserPassword: (userId, newPassword) =>
    prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    }),

  findUserByRefreshToken: (token) =>
    prisma.user.findUnique({
      where: { refreshToken: token },
    }),

  deleteRefreshToken: (userId) =>
    prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    }),
};

module.exports = authRepository;
