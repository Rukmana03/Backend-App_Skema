const classRepository = require("../repositories/classRepository");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { throwError } = require("../utils/responeHandler");

const classService = {
  createClass: async (data) => {
    return await classRepository.createClass(data);
  },

  getAllClasses: async () => {
    return await classRepository.getAllClasses();
  },

  getClassById: async (id) => {
    return await classRepository.getClassById(id);
  },

  updateClass: async (id, data) => {
    return await classRepository.updateClass(id, data);
  },

  deleteClass: async (id) => {
    return await classRepository.deleteClass(id);
  },

  addStudentToClass: async (classId, studentId) => {
    // Cek apakah kelas ada
    const existingClass = await prisma.class.findUnique({
      where: { id: Number(classId) },
    });
    if (!existingClass) {
      throwError(404, "Class not found");
    }

    // Cek apakah murid sudah terdaftar di kelas mana pun dengan status "Active"
    const activeStudent = await prisma.studentClass.findFirst({
      where: {
        studentId: Number(studentId),
        status: "Active", // Hanya cek murid yang statusnya masih aktif
      },
    });

    if (activeStudent) {
      throwError(400, "Student is already assigned to another class. Deactivate the previous class first.");
    }

    // Cek apakah murid sudah ada dalam kelas ini (baik active atau inactive)
    const existingStudent = await prisma.studentClass.findFirst({
      where: { classId: Number(classId), studentId: Number(studentId) },
    });

    if (existingStudent) {
      throwError(400, "Student is already in this class");
    }

    // Tambahkan murid ke kelas dengan status "Active"
    return await prisma.studentClass.create({
      data: {
        classId: Number(classId),
        studentId: Number(studentId),
        status: "Active",
      },
    });
  },

  deactivateStudentInClass: async (classId, studentId) => {
    const result = await classRepository.deactivateStudentInClass(classId, studentId);
    if (result.count === 0) {
      throwError(400, "Student is either not in this class or already inactive.");
    }

    return { message: "Student has been deactivated from the class." };
  },

  getClassWithMembers: async (classId) => {
    const classData = await classRepository.getClassDetails(classId);

    if (!classData) {
      throwError(404, "Class not found");
    }
    return {
      id: classData.id,
      className: classData.className,
      status: classData.status,
      students: classData.studentClasses.map((sc) => ({
        id: sc.Student.id,
        name: sc.Student.name,
        email: sc.Student.email,
        status: sc.status, // Menampilkan status Active/Inactive
      })),
      teachers: classData.teacherClasses.map((tc) => ({
        id: tc.teacher.id,
        name: tc.teacher.name,
        email: tc.teacher.email,
      })),
    };
  },

};

module.exports = classService;
