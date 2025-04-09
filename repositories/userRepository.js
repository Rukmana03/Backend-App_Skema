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
      orderBy: { createdAt: "desc" },
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
        role: true,
        refreshToken: true,
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
};

module.exports = userRepository;
