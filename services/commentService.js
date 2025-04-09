const commentRepository = require("../repositories/commentRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const submissionRepository = require("../repositories/submissionRepository");
const notificationService = require("../services/notificationService");
const { createCommentSchema } = require("../validations/commentValidation");
const { throwError } = require("../utils/responseHandler");

const commentService = {
    addComment: async (assignmentId, submissionId, userId, text) => {
        // Validasi heula
        const { error } = createCommentSchema.validate({ assignmentId, submissionId, text });
        if (error) throwError(400, error.details[0].message);

        // Buat komentar di database
        const comment = await commentRepository.createComment(assignmentId, submissionId, userId, text);

        let targetUserId;

        if (submissionId) {
            const submission = await submissionRepository.getSubmissionById(submissionId);
            if (!submission) throwError(404, "Submission tidak ditemukan");
            targetUserId = submission.studentId;
        } else if (assignmentId) {
            const assignment = await assignmentRepository.getAssignmentById(assignmentId);
            if (!assignment) throwError(404, "Assignment tidak ditemukan");
            targetUserId = assignment.teacherId;
        }

        if (targetUserId) {
            await notificationService.sendNotification(targetUserId, "Anda mendapatkan komentar baru.");
        }

        return comment;
    },

    getCommentsByAssignment: async (assignmentId) => {
        const comments = await commentRepository.findCommentsByAssignment(assignmentId);
        return { message: "Komentar berhasil diambil", data: comments || [] };
    },

    getCommentsBySubmission: async (submissionId) => {
        const comments = await commentRepository.findCommentsBySubmission(submissionId);
        return { message: "Komentar berhasil diambil", data: comments || [] };
    },
};

module.exports = commentService;
