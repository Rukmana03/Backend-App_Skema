const classService = require("../services/classService");
const { errorResponse, successResponse, } = require("../utils/responeHandler");

const classController = {
  createClass: async (req, res) => {
    try {
      const newClass = await classService.createClass(req.body);
      res.status(201).json({ message: "Class created successfully", data: newClass });
    } catch (error) {
      res.status(400).json({ message: "Error creating class", error: error.message });
    }
  },

  getAllClasses: async (req, res) => {
    try {
      const classes = await classService.getAllClasses();

      if (!classes || classes.length === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      res.status(200).json({ message: "Data berhasil ditemukan", data: classes });
    } catch (error) {

      res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
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
      res.status(200).json({ message: "Data berhasil ditemukan", data: classDetails });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
  },

  moveStudentToClass: async (req, res) => {
    try {
      const { studentId, newClassId } = req.body;

      if (!studentId || !newClassId) {
        return res.status(400).json({ message: "studentId dan newClassId diperlukan." });
      }
      const result = await classService.moveStudent(studentId, newClassId);
      res.status(200).json({ message: result.message });
    } catch (error) {
      res.status(500).json({ message: "Gagal memindahkan siswa", error: error.message });
    }
  },

  getActiveStudentsInClass: async (req, res) => {
    try {
      const { id } = req.params;
      const classId = Number(id);

      if (!classId) {
        return res.status(400).json({ success: false, message: "classId diperlukan." });
      }

      const students = await classService.getActiveStudentsInClass(classId);
      res.status(200).json({ success: true, data: students });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mendapatkan siswa aktif", error: error.message });
    }
  },

  getSubjectsByClassId: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({  message: "classId diperlukan." });
      }

      const subjects = await classService.getSubjectsByClassId(id);
      res.status(200).json({ message: "Data berhasil ditemukan", data: subjects });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mendapatkan subject kelas", error: error.message });
    }
  },

};

module.exports = classController;

// addTeacherToClass: async (req, res) => {
//   try {
//     const { id } = req.params; // ID kelas
//     const { teacherId } = req.body;
//     await classService.addTeacherToClass(id, teacherId);
//     return successResponse(res, 200, "Teacher berhasil ditambahkan ke kelas");
//   } catch (error) {
//     return errorResponse(res, error.status || 500, error.message);
//   }
// },