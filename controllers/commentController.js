const commentService = require("../services/commentService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const commentController = {
    addCommentToAssignment: async (req, res) => {
        try {
            const userId = req.user.id;
            const assignmentId = Number(req.params.assignmentId);
            const { text } = req.body;
            const comment = await commentService.addComment({ assignmentId, userId, text });
            return successResponse(res, 201, "Comments successfully added to task", comment);
        } catch (error) {
            console.error(error);
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    addCommentToSubmission: async (req, res) => {
        try {
            const userId = req.user.id;
            const submissionId = Number(req.params.submissionId);
            const { text } = req.body;

            if (!text) {
                return errorResponse(res, 400, "Comments are required");
            }

            const comment = await commentService.addComment({ submissionId, userId, text });
            return successResponse(res, 201, "Comment successfully added to submission", comment);
        } catch (error) {
            console.error(error);
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    getCommentsByAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const comments = await commentService.getCommentsByAssignment(Number(assignmentId));
            return successResponse(res, 200, comments.message, comments.data);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    getCommentsBySubmission: async (req, res) => {
        try {
            const { submissionId } = req.params;
            const comments = await commentService.getCommentsBySubmission(Number(submissionId));
            return successResponse(res, 200, comments.message, comments.data);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    updateComment: async (req, res) => {
        try {
            const { commentId } = req.params;
            const { text } = req.body;
            const userId = req.user.id;

            if (!text) {
                return errorResponse(res, 400, "Comment text is required");
            }

            const updatedComment = await commentService.updateComment(commentId, userId, text);

            if (!updatedComment) {
                return errorResponse(res, 404, "Comment not found or you do not have access");
            }

            return successResponse(res, 200, "Comment successfully updated", updatedComment);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    deleteComment: async (req, res) => {
        try {
            const { commentId } = req.params;
            const userId = req.user.id;

            const deletedComment = await commentService.deleteComment(commentId, userId);

            if (!deletedComment) {
                return errorResponse(res, 404, "Comment not found or you do not have access");
            }

            return successResponse(res, 200, "Comment successfully deleted");
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },
};

module.exports = commentController;
