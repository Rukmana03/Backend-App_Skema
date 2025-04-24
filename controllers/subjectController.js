const subjectService = require("../services/subjectService");
const { errorResponse, successResponse } = require("../utils/responseHandler");

const subjectController = {
    createSubject: async (req, res) => {
        try {
            const { subjectName, description } = req.body;
            const subjectData = await subjectService.createSubject(subjectName, description);
            return successResponse(res, 201, "Subject created successfully", subjectData);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    getAllSubjects: async (req, res) => {
        try {
            const subjects = await subjectService.getAllSubjects();
            return successResponse(res, 200, "Subjects retrieved successfully", subjects);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    getSubjectById: async (req, res) => {
        try {
            const { id } = req.params;
            const subject = await subjectService.getSubjectById(id);
            return successResponse(res, 200, "Subject found", subject);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    updateSubject: async (req, res) => {
        try {
            const { id } = req.params;
            const { subjectName, description } = req.body;
            const updatedSubject = await subjectService.updateSubject(id, subjectName, description);
            return successResponse(res, 200, "Subject updated successfully", updatedSubject);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    deleteSubject: async (req, res) => {
        try {
            const { id } = req.params;
            await subjectService.deleteSubject(id);
            return successResponse(res, 200, "Subject deleted successfully");
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

};

module.exports = subjectController;
