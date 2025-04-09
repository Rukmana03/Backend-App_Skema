const classService = require("../services/classService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const classController = {

  createClass: async (req, res) => {
    try {
      const newClass = await classService.createClass(req.body);
      return successResponse(res, 201, "Class created successfully", newClass);
    } catch (error) {
      return errorResponse(res, error.status || 400, error.message);
    }
  },

  getAllClasses: async (req, res) => {
    try {
      const classes = await classService.getAllClasses();
      return successResponse(res, 200, "Data berhasil ditemukan", classes);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  getClassById: async (req, res) => {
    try {
      const { id } = req.params;
      const classData = await classService.getClassById(Number(id));
      return successResponse(res, 200, "Data berhasil ditemukan", classData);
    } catch (error) {
      return errorResponse(res, error.status || 400, error.message);
    }
  },

  updateClass: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedClass = await classService.updateClass(Number(id), req.body);
      return successResponse(res, 200, "Class updated successfully", updatedClass);
    } catch (error) {
      return errorResponse(res, error.status || 400, error.message);
    }
  },

  deleteClass: async (req, res) => {
    try {
      const { id } = req.params;
      await classService.deleteClass(Number(id));
      return successResponse(res, 200, "Class deleted successfully");
    } catch (error) {
      return errorResponse(res, error.status || 400, error.message);
    }
  },

  addStudentToClass: async (req, res) => {
    try {
      const { id } = req.params;
      const { studentId } = req.body;

      await classService.addStudentToClass({ classId: Number(id), studentId: Number(studentId) });

      return successResponse(res, 200, "Student berhasil ditambahkan ke kelas");
    } catch (error) {
      return errorResponse(res, error.status || 400, error.message);
    }
  },

  deactivateStudentInClass: async (req, res) => {
    try {
      const { classId, studentId } = req.params;
      const result = await classService.deactivateStudentInClass(classId, studentId);
      return successResponse(res, 200, "Student berhasil dinonaktifkan", result);
    } catch (error) {
      return errorResponse(res, error.status || 400, error.message);
    }
  },

  getClassMembers: async (req, res) => {
    try {
      const { id } = req.params;
      const classDetails = await classService.getClassWithMembers(id);
      return successResponse(res, 200, "Data berhasil ditemukan", classDetails);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  moveStudentToClass: async (req, res) => {
    try {
      const { studentId, newClassId } = req.body;
      const result = await classService.moveStudent(studentId, newClassId);
      return successResponse(res, 200, result.message);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  getActiveStudentsInClass: async (req, res) => {
    try {
      const { id } = req.params;
      const students = await classService.getActiveStudentsInClass(Number(id));
      return successResponse(res, 200, "Data berhasil ditemukan", students);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  getSubjectsByClassId: async (req, res) => {
    try {
      const { id } = req.params;
      const subjects = await classService.getSubjectsByClassId(id);
      return successResponse(res, 200, "Data berhasil ditemukan", subjects);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

};

module.exports = classController;
