const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authRepository = {
  findUserByEmail: (email) => prisma.user.findUnique({ where: { email } }),

  saveRefreshToken: async (userId, token) => {
    return await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  },

  findRefreshToken: async (token) => {
    return await prisma.user.findUnique({
      where: { refreshToken: token },
    });
  },

  deleteRefreshToken: async (userId) => {
    return await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },

  updateUserRefreshToken: async (userId, refreshToken) => {
    return await prisma.user.update({
      where: { id: userId },
      data: { refreshToken }, // Sesuaikan dengan nama kolom di database
    });
  },

};

module.exports = authRepository;
