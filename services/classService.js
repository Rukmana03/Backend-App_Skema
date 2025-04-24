const classRepository = require("../repositories/classRepository");
const { throwError } = require("../utils/responseHandler");
const folderHelper = require("../utils/folderHelper");
const { createClassSchema } = require("../validations/classValidation");

const classService = {
  createClass: async (data) => {
    const { error } = createClassSchema.validate(data);
    if (error) throwError(400, error.details[0].message);

    const { schoolId, className, academicYearId } = data;

    const existingClass = await classRepository.findClassByNameAndSchool(schoolId, className);
    if (existingClass) throwError(400, "Nama kelas sudah digunakan dalam sekolah ini. Gunakan nama lain.");

    const newClass = await classRepository.createClass({
      schoolId,
      className,
      status: "Active",
      academicYearId,
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
