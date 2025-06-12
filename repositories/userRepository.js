const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userRepository = {
  createUser: async (username, email, password, role) => {
    return await prisma.user.create({
      data: { username, email, password, role },
    });
  },

  updateUser: async (id, updateData) => {
    return await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });
  },

  deleteUser: async (id) => {
    return await prisma.user.delete({
      where: { id: Number(id) },
    });
  },

  findAllUsers: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },

  clearRefreshToken: async (userId) => {
    return await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },

  findUserByEmail: async (email) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  findUserById: async (id) => {
    return await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role:{
          select:{
            id: true,
            name: true
          },
        },
      },
    });
  },

  findUsersByRole: async (role) => {
    return await prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
  },

  incrementRefreshAttempts: async (userId) => {
    return await prisma.user.update({
      where: { id: userId },
      data: { refreshAttempts: { increment: 1 } },
    });
  },

  resetRefreshAttempts: async (userId) => {
    return await prisma.user.update({
      where: { id: userId },
      data: { refreshAttempts: 0 },
    });
  },

};

module.exports = userRepository;
