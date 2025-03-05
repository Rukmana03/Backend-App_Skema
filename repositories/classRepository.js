const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const classRepository = {
  createClass: async (data) => {
    return await prisma.class.create({ data });
  },

  getAllClasses: async () => {
    return await prisma.class.findMany({
      where: { deletedAt: null },
    });
  },

  getClassById: async (id) => {
    return await prisma.class.findUnique({
      where: { id, deletedAt: null },
    });
  },

  updateClass: async (id, data) => {
    return await prisma.class.update({
      where: { id },
      data,
    });
  },

  deleteClass: async (id) => {
    return await prisma.class.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  addStudentToClass: async (classId, studentId) => {
    return await prisma.studentClass.create({
      data: { classId, studentId, status: "Active" },
    });
  },

  addTeacherToClass: async (classId, teacherId) => {
    return await prisma.teacherClass.create({
      data: { classId, teacherId },
    });
  },
};

module.exports = classRepository;
