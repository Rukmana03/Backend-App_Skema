const classRepository = require("../repositories/classRepository");

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
    return await classRepository.addStudentToClass(classId, studentId);
  },

  addTeacherToClass: async (classId, teacherId) => {
    return await classRepository.addTeacherToClass(classId, teacherId);
  },
};

module.exports = classService;
