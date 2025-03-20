const classRepository = require("../repositories/classRepository");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { throwError } = require("../utils/responeHandler");

const classService = {
  createClass: async (data) => {
    return await classRepository.createClass(data);
  },

  getAllClasses: async () => {
    const classes = await classRepository.getAllClasses();
    return classes;
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
        username: sc.Student.username,
        email: sc.Student.email,
        status: sc.status,
      })),
      subjects: classData.subjectClasses.map((sc) => ({
        id: sc.subject.id,
        subjectName: sc.subject.subjectName,
        description: sc.subject.description,
        teacher: sc.teacher
          ? {
            id: sc.teacher.id,
            username: sc.teacher.username,
            email: sc.teacher.email,
          }
          : null, // Jika teacher tidak ada
      })),
    };
  },

  moveStudent: async (studentId, newClassId) => {
    studentId = Number(studentId);
    newClassId = Number(newClassId);

    // Cek apakah siswa saat ini ada di kelas aktif
    const currentEnrollment = await classRepository.getActiveStudentClass(studentId);
    if (!currentEnrollment) {
      throw new Error("Siswa tidak ditemukan dalam kelas aktif mana pun.");
    }

    // Cek apakah kelas tujuan aktif
    const newClass = await classRepository.getClassById(newClassId);
    if (!newClass || newClass.status !== "Active") {
      throw new Error("Kelas tujuan tidak aktif atau tidak ditemukan.");
    }

    // Pindahkan siswa ke kelas baru
    await classRepository.moveStudent(currentEnrollment.id, newClassId);

    return { message: "Siswa berhasil dipindahkan ke kelas baru." };
  },

  getActiveStudentsInClass: async (classId) => {
    classId = Number(classId);

    if (isNaN(classId)) {
      throw new Error("classId harus berupa angka.");
    }

    const students = await classRepository.getActiveStudentClass(classId);

    if (students.length === 0) {
      throw new Error("Tidak ada siswa aktif dalam kelas ini.");
    }

    return students.map((studentClass) => ({
      id: studentClass.Student.id,
      name: studentClass.Student.name,
      email: studentClass.Student.email,
    }));
  },

  getSubjectsByClassId: async (classId) => {
    classId = Number(classId);

    if (isNaN(classId)) {
      throw new Error("classId harus berupa angka.");
    }

    const subjects = await classRepository.getSubjectsByClassId(classId);

    if (!subjects.length) {
      throw new Error("Tidak ada subject dalam kelas ini.");
    }

    return subjects.map((subjectClass) => ({
      id: subjectClass.subject.id,
      Subjectname: subjectClass.subject.subjectName,
      teacher: subjectClass.teacher
        ? {
          id: subjectClass.teacher.id,
          username: subjectClass.teacher.username,
          email: subjectClass.teacher.email
        }
        : null
    }));
  },

};

module.exports = classService;

// addTeacherToClass: async (classId, teacherId) => {
//   // Cek apakah kelas ada
//   const existingClass = await prisma.class.findUnique({
//     where: { id: Number(classId) },
//   });
//   if (!existingClass) {
//     throwError(404, "Class not found");
//   }

//   // Cek apakah guru sudah ada dalam kelas
//   const existingTeacher = await prisma.subjectClass.findFirst({
//     where: { classId: Number(classId), teacherId: Number(teacherId) },
//   });

//   if (existingTeacher) {
//     throwError(400, "Teacher is already assigned to this class");
//   }

//   // Tambahkan guru ke kelas
//   return await prisma.subjectClass.create({
//     data: {
//       classId: Number(classId),
//       teacherId: Number(teacherId),
//     },
//   });
// },
