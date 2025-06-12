const submissionService = require("../services/submissionService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const submissionController = {
    createSubmission: async (req, res) => {
        try {
            const { assignmentId } = req.body;
            const files = req.files;
            const currentUser = req.user;
            
            const submission = await submissionService.createSubmission(assignmentId, currentUser, files);

            return successResponse(res, 201, "Submission successfully made", submission);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    getSubmissionById: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const submission = await submissionService.getSubmissionById(id);
            return successResponse(res, 200, "Submission details were successfully taken", submission);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    getAllSubmissions: async (req, res) => {
        try {
            const submissions = await submissionService.getAllSubmissions();
            return successResponse(res, 200, "Submissions retrieved successfully", submissions);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    updateSubmission: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const updated = await submissionService.updateSubmission(id, req.body);
            return successResponse(res, 200, "Submission was successfully updated", updated);
        } catch (error) {
            return errorResponse(res, error.status || 400, error.message || "Internal server error");
        }
    },

    deleteSubmission: async (req, res) => {
        try {
            const submissionId = Number(req.params.id);
            const { id: userId, role: userRole } = req.user;

            const result = await submissionService.deleteSubmission({ submissionId, userId, userRole });

            return successResponse(res, 200, "Submission successfully deleted", result);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

};

module.exports = submissionController;
