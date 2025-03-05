const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = (username, email, password, role) =>
  prisma.user.create({ data: { username, email, password, role } });

const updateUser = (id, updateData) =>
  prisma.user.update({ where: { id: parseInt(id, 10) }, data: updateData });

const deleteUser = (id) =>
  prisma.user.delete({ where: { id: parseInt(id, 10) } });

const findAllUsers = () => prisma.user.findMany();

const findUserByEmail = (email) => prisma.user.findUnique({ where: { email } });

const findUserById = (id) =>
  prisma.user.findUnique({ where: { id: parseInt(id, 10) } });

const findUsersByRole = (role) => {
  return prisma.user.findMany({
    where: { role },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
};

module.exports = {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  findUserByEmail,
  findUsersByRole,
};
