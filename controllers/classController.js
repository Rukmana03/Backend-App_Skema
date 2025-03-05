const classService = require("../services/classService");

const createClass = async (req, res) => {
  try {
    const newClass = await classService.createClass(req.body);
    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await classService.getAllClasses();
    res.status(200).json({ success: true, data: classes });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await classService.getClassById(Number(id));
    res.status(200).json({ success: true, data: classData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClass = await classService.updateClass(Number(id), req.body);
    res.status(200).json({ success: true, data: updatedClass });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await classService.deleteClass(Number(id));
    res.status(200).json({ success: true, message: "Kelas berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const addStudentToClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;
    const result = await classService.addStudentToClass(
      Number(id),
      Number(studentId)
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const addTeacherToClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId } = req.body;
    const result = await classService.addTeacherToClass(
      Number(id),
      Number(teacherId)
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  addStudentToClass,
  addTeacherToClass,
};
