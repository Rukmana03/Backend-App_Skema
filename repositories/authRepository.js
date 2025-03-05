const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findUserByEmail = (email) => prisma.user.findUnique({ where: { email } });

const saveRefreshToken = async (userId, token) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token },
  });
};

const findRefreshToken = async (token) => {
  return await prisma.user.findUnique({
    where: { refreshToken: token },
  });
};

const deleteRefreshToken = async (userId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

const updateUserRefreshToken = async (userId, refreshToken) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { refreshToken }, // Sesuaikan dengan nama kolom di database
  });
};

module.exports = {
  findUserByEmail,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  updateUserRefreshToken,
};
