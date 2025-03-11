const classService = require("../services/classService");
const { errorResponse, successResponse, } = require("../utils/responeHandler");

const classController = {
  createClass: async (req, res) => {
    try {
      const newClass = await classService.createClass(req.body);
      res.status(201).json({ success: true, data: newClass });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  },

  getAllClasses: async (req, res) => {
    try {
      const classes = await clasgsService.getAllClasses();
      res.status(200).json({ success: true, data: classes });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  },

  getClassById: async (req, res) => {
    try {
      const { id } = req.params;
      const classData = await classService.getClassById(Number(id));
      res.status(200).json({ success: true, data: classData });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateClass: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedClass = await classService.updateClass(Number(id), req.body);
      res.status(200).json({ success: true, data: updatedClass });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteClass: async (req, res) => {
    try {
      const { id } = req.params;
      await classService.deleteClass(Number(id));
      res.status(200).json({ success: true, message: "Kelas berhasil dihapus" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  addStudentToClass: async (req, res) => {
    try {
      const { id } = req.params; // ID kelas
      const { studentId } = req.body;
      await classService.addStudentToClass(id, studentId);
      return successResponse(res, 200, "Student berhasil ditambahkan ke kelas");
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  addTeacherToClass: async (req, res) => {
    try {
      const { id } = req.params; // ID kelas
      const { teacherId } = req.body;
      await classService.addTeacherToClass(id, teacherId);
      return successResponse(res, 200, "Teacher berhasil ditambahkan ke kelas");
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  deactivateStudentInClass: async (req, res) => {
    try {
      const { classId, studentId } = req.params;
      const response = await classService.deactivateStudentInClass(classId, studentId);
      return successResponse(res, 200, "Student berhasil dinonaktifkan", response);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  getClassMembers: async (req, res) => {
    try {
      const { id } = req.params; // ID kelas
      const classDetails = await classService.getClassWithMembers(id);
      return successResponse(res, 200, "Berhasil mendapatkan data kelas", classDetails);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

};

module.exports = classController;
