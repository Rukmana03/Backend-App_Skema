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
      return successResponse(res, 200, "Data was found", classes);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  getClassById: async (req, res) => {
    try {
      const { id } = req.params;
      const classData = await classService.getClassById(Number(id));
      return successResponse(res, 200, "Data was found", classData);
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

  getClassMembers: async (req, res) => {
    try {
      const { id } = req.params;
      const classDetails = await classService.getClassWithMembers(id);
      return successResponse(res, 200, "Data was found", classDetails);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  getSubjectsByClassId: async (req, res) => {
    try {
      const { id } = req.params;
      const subjects = await classService.getSubjectsByClassId(id);
      return successResponse(res, 200, "Data was found", subjects);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

};

module.exports = classController;
