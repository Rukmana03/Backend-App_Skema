const classRepository = require("../repositories/classRepository");
const { throwError } = require("../utils/responseHandler");
const folderHelper = require("../utils/folderHelper");
const { createClassSchema, addStudentSchema } = require("../validations/classValidation");

const classService = {
  createClass: async (data) => {
    const { error } = createClassSchema.validate(data);
    if (error) throwError(400, error.details[0].message);

    const { schoolId, className } = data;

    const existingClass = await classRepository.findClassByNameAndSchool(schoolId, className);
    if (existingClass) throwError(400, "Nama kelas sudah digunakan dalam sekolah ini. Gunakan nama lain.");

    const newClass = await classRepository.createClass({
      schoolId,
      className,
      status: "Active"
    });

    folderHelper.createClassFolder(newClass.schoolId, newClass.id);
    return newClass;
  },

  updateClass: async (id, data) => {
    await classService.getClassById(id);
    return await classRepository.updateClass(id, data);
  },

  deleteClass: async (id) => {
    await classService.getClassById(id);
    return await classRepository.deleteClass(id);
  },

  addStudentToClass: async (data) => {
    const { error } = addStudentSchema.validate(data);
    if (error) throwError(400, error.details[0].message);

    const { classId, studentId } = data;

    const existingClass = await classRepository.getClassById(classId);
    if (!existingClass || existingClass.deletedAt) throwError(404, "Class not found");

    const activeStudent = await classRepository.getActiveStudentClass(classId);
    if (activeStudent.find(s => s.studentId === Number(studentId))) {
      throwError(400, "Student is already assigned to another class. Deactivate the previous class first.");
    }

    const existingStudent = await classRepository.getClassDetails(classId);
    if (existingStudent?.studentClasses?.some(sc => sc.studentId === Number(studentId))) {
      throwError(400, "Student is already in this class");
    }

    return await classRepository.addStudentToClass(classId, studentId);
  },

  deactivateStudentInClass: async (classId, studentId) => {
    if (!classId || !studentId) throwError(400, "classId dan studentId wajib diisi");

    const result = await classRepository.deactivateStudentInClass(classId, studentId);
    if (result.count === 0) {
      throwError(400, "Student is either not in this class or already inactive.");
    }
    return { message: "Student has been deactivated from the class." };
  },

  moveStudent: async (studentId, newClassId) => {
    if (!studentId || !newClassId) throwError(400, "studentId dan newClassId wajib diisi");

    const activeClass = await classRepository.getActiveStudentClass(studentId);
    if (!activeClass.length) throwError(400, "Siswa tidak ditemukan dalam kelas aktif mana pun.");

    const newClass = await classRepository.getClassById(newClassId);
    if (!newClass || newClass.status !== "Active") throwError(400, "Kelas tujuan tidak aktif atau tidak ditemukan.");

    await classRepository.moveStudent(activeClass[0].id, newClassId);
    return { message: "Siswa berhasil dipindahkan ke kelas baru." };
  },

  getActiveStudentsInClass: async (classId) => {
    if (!classId) throwError(400, "classId wajib diisi");

    const students = await classRepository.getActiveStudentClass(classId);
    if (!students.length) throwError(404, "Tidak ada siswa aktif dalam kelas ini.");

    return students.map((sc) => ({
      id: sc.Student.id,
      username: sc.Student.username,
      email: sc.Student.email,
    }));
  },

  getSubjectsByClassId: async (classId) => {
    if (!classId) throwError(400, "classId wajib diisi");

    const subjects = await classRepository.getSubjectsByClassId(classId);
    if (!subjects.length) throwError(404, "Tidak ada subject dalam kelas ini.");

    return subjects.map((subjectClass) => ({
      id: subjectClass.subject.id,
      subjectName: subjectClass.subject.subjectName,
      teacher: subjectClass.teacher
        ? {
          id: subjectClass.teacher.id,
          username: subjectClass.teacher.username,
          email: subjectClass.teacher.email
        }
        : null
    }));
  },

  getClassWithMembers: async (classId) => {
    if (!classId) throwError(400, "classId wajib diisi");

    const classData = await classRepository.getClassDetails(classId);
    if (!classData) throwError(404, "Class not found");

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
          : null,
      })),
    };
  },

  getAllClasses: async () => {
    return await classRepository.getAllClasses();
  },

  getClassById: async (id) => {
    if (!id) throwError(400, "id wajib diisi");

    const classData = await classRepository.getClassById(id);
    if (!classData || classData.deletedAt) throwError(404, "Class not found");
    return classData;
  },
};

module.exports = classService;
