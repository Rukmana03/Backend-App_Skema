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
    return await prisma.class.create({
      data: {
        className: data.className,
        status: data.status,
        schoolId: data.schoolId,
      },
    });
  },

  getAllClasses: async () => {
    return await prisma.class.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        schoolId: true,
        className: true,
        status: true,
      }
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
              select: { id: true, username: true, email: true }, // Ambil username & email siswa
            }
          },
        },
        subjectClasses: {
          include: {
            subject: {
              select: { id: true, subjectName: true, description: true } // Ambil data subject
            },
            teacher: {
              select: { id: true, username: true, email: true } // Ambil username guru
            }
          },
        },
      },
    });
  },

  moveStudent: async (studentId, newClassId) => {

    const studentClass = await prisma.studentClass.findFirst({
      where: { studentId, status: "Active" } 
    });

    if (!studentClass) {
      throw new Error("Siswa tidak ditemukan dalam kelas aktif.");
    }
    return await prisma.studentClass.update({
      where: { id: studentClass.id },
      data: { classId: newClassId },
    });
  },

  getActiveStudentClass: async (classId) => {
    return await prisma.studentClass.findMany({
      where: { classId: Number(classId), status: "Active" },
      include: { Student: true }
    });
  },

  getSubjectsByClassId: async (classId) => {
    return await prisma.subjectClass.findMany({
      where: { classId },
      include: {
        subject: { select: { id: true, subjectName: true } },
        teacher: { select: { id: true, username: true, email: true } }
      }
    });
  },

};

module.exports = classRepository;

// addTeacherToClass: async (classId, teacherId) => {
//   return await prisma.subjectClass.create({
//     data: {
//       classId: parseInt(classId),
//       teacherId: parseInt(teacherId)
//     },
//   });
// },

