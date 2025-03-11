const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { throwError } = require("../utils/responeHandler")

const classRepository = {
  createClass: async (data) => {
    // Cek apakah kelas dengan nama yang sama sudah ada
    const existingClass = await prisma.class.findFirst({
      where: { className: data.className },
    });

    if (existingClass) {
      throwError(400, "Class name already exists. Please use a different name.");
    }

    // Jika tidak ada kelas dengan nama yang sama, buat kelas baru
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
      data: {
        classId: Number(classId),
        studentId: Number(studentId),
        status: "Active"
      },
    });
  },

  addTeacherToClass: async (classId, teacherId) => {
    return await prisma.teacherClass.create({
      data: {
        classId: parseInt(classId),
        teacherId: parseInt(teacherId)
      },
    });
  },

  deactivateStudentInClass: async (classId, studentId) => {
    return await prisma.studentClass.updateMany({
      where: {
        classId: Number(classId),
        studentId: Number(studentId),
        status: "Active", // Pastikan hanya yang aktif yang bisa dinonaktifkan
      },
      data: {
        status: "Inactive",
      },
    });
  },

  getClassDetails: async (classId) => {
    return await prisma.class.findUnique({
      where: { id: Number(classId) },
      include: {
        studentClasses: {
          include: {
            Student: {
              select: { id: true, username: true, email: true }, // Sesuaikan dengan kolom di model User
            }
          },
        },
        teacherClasses: {
          include: {
            teacher: {
              select: { id: true, username: true, email: true },
            }
          },
        },
      },
    });
  },

};

module.exports = classRepository;
