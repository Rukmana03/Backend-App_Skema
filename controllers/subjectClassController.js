const subjectClassService = require("../services/subjectClassService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const subjectClassController = {
    createSubjectClass: async (req, res) => {
        try {
            const result = await subjectClassService.createSubjectClass(req.body);
            return successResponse(res, 201, "Subject assigned to class successfully", result);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    getAllSubjectClasses: async (req, res) => {
        try {
            const result = await subjectClassService.getAllSubjectClasses();
            return successResponse(res, 200, "All subject-class data retrieved", result);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    getSubjectClassesByClass: async (req, res) => {
        try {
            const result = await subjectClassService.getSubjectClassesByClass(req.params.classId);
            return successResponse(res, 200, "Subject-classes for class retrieved", result);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    getSubjectClassesByTeacher: async (req, res) => {
        try {
            const result = await subjectClassService.getSubjectClassesByTeacher(req.params.teacherId);
            return successResponse(res, 200, "Subject-classes for teacher retrieved", result);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    updateSubjectClass: async (req, res) => {
        try {
            const result = await subjectClassService.updateSubjectClass(req.params.id, req.body);
            return successResponse(res, 200, "SubjectClass updated", result);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    deleteSubjectClass: async (req, res) => {
        try {
            const result = await subjectClassService.deleteSubjectClass(req.params.id);
            return successResponse(res, 200, "SubjectClass deleted", result);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },
};

module.exports = subjectClassController;
