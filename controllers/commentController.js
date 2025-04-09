const commentService = require("../services/commentService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const commentController = {
    // ⬇️ Comment ke Assignment
    addCommentToAssignment: async (req, res) => {
        try {
            const userId = req.user.id;
            const { assignmentId } = req.params;
            const { text } = req.body;

            const comment = await commentService.addComment(assignmentId, null, userId, text);
            return successResponse(res, 201, "Komentar berhasil ditambahkan ke assignment", comment);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal menambahkan komentar");
        }
    },

    // ⬇️ Comment ke Submission
    addCommentToSubmission: async (req, res) => {
        try {
            const userId = req.user.id;
            const { submissionId } = req.params;
            const { text } = req.body;

            const comment = await commentService.addComment(null, submissionId, userId, text);
            return successResponse(res, 201, "Komentar berhasil ditambahkan ke submission", comment);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal menambahkan komentar");
        }
    },

    // ⬇️ Get Comments from Assignment
    getCommentsByAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const comments = await commentService.getCommentsByAssignment(Number(assignmentId));
            return successResponse(res, 200, comments.message, comments.data);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal mengambil komentar");
        }
    },

    // ⬇️ Get Comments from Submission
    getCommentsBySubmission: async (req, res) => {
        try {
            const { submissionId } = req.params;
            const comments = await commentService.getCommentsBySubmission(Number(submissionId));
            return successResponse(res, 200, comments.message, comments.data);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal mengambil komentar");
        }
    },
};

module.exports = commentController;
