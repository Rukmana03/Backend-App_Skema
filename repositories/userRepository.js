const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

const userRepository = {
  createUser: (username, email, password, role) =>
    prisma.user.create({ data: { username, email, password, role } }),

  updateUser: (id, updateData) =>
    prisma.user.update({ where: { id: parseInt(id, 10) }, data: updateData }),

  deleteUser: (id) =>
    prisma.user.delete({ where: { id: parseInt(id, 10) } }),

  findAllUsers: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      }
    });
  },

  findUserByEmail: (email) => prisma.user.findUnique({ where: { email } }),

  findUserById: (id) =>
    prisma.user.findUnique({ where: { id: parseInt(id, 10) } }),

  findUsersByRole: (role) => {
    return prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  },

};

module.exports = userRepository;
