const commentRepository = require("../repositories/commentRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const submissionRepository = require("../repositories/submissionRepository");
const notificationService = require("../services/notificationService");
const { createCommentSchema } = require("../validations/commentValidation");
const { throwError } = require("../utils/responseHandler");

const commentService = {
    addComment: async ({ assignmentId = null, submissionId = null, userId, text }) => {
        const { error } = createCommentSchema.validate({ assignmentId, submissionId, text });
        if (error) throwError(400, error.details[0].message);

        if (!text) {
            throwError(400, "Comments cannot be empty");
        }

        let targetUserId;

        if (submissionId) {
            const submission = await submissionRepository.getSubmissionById(submissionId);
            if (!submission) throwError(404, "Submission is not found");
            if (!submission.student) throwError(500, "Student relations in submissions were not found");

            targetUserId = submission.student.id;
        }
        else if (assignmentId) {
            const assignment = await assignmentRepository.getAssignmentById(assignmentId);
            if (!assignment) throwError(404, "Assignment is not found");
            if (!assignment.subjectClass || !assignment.subjectClass.teacher)
                throwError(500, "Teacher relations on assignment are not found");

            targetUserId = assignment.subjectClass.teacher.id;
        }

        const comment = await commentRepository.createComment({
            assignmentId,
            submissionId,
            userId,
            text
        });

        if (targetUserId) {
            try {
                const notificationData = {
                    userId: targetUserId,
                    message: "You get new comments."
                };
                await notificationService.sendNotification(notificationData);
            } catch (error) {
                console.error(`Failed to send notifications to userId: ${targetUserId}`, error);
            }
        }

        return comment;
    },

    updateComment: async (commentId, userId, text) => {
        const comment = await commentRepository.findCommentById(commentId);
        if (!comment) throwError(404, "Comments were not found");

        if (comment.user.id !== userId) throwError(403, "You have no right to edit this comment");
        return await commentRepository.updateComment(commentId, { content: text });
    },

    deleteComment: async (commentId, userId) => {
        const comment = await commentRepository.findCommentById(commentId);
        if (!comment) throwError(404, "Comments were not found");

        if (comment.user.id !== userId) throwError(403, "You have no right to delete this comment");
        return await commentRepository.deleteComment(commentId);
    },

    getCommentsByAssignment: async (assignmentId) => {
        const comments = await commentRepository.findCommentsByAssignment(assignmentId);
        return { message: "Comments were successfully taken", data: comments || [] };
    },

    getCommentsBySubmission: async (submissionId) => {
        const comments = await commentRepository.findCommentsBySubmission(submissionId);
        return { message: "Comments were successfully taken", data: comments || [] };
    },
};

module.exports = commentService;
