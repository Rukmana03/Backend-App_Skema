const commentRepository = require("../repositories/commentRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const submissionRepository = require("../repositories/submissionRepository");
const notificationService = require("../services/notificationService");

const commentService = {
    addComment: async (assignmentId, submissionId, userId, text) => {
        // Buat komentar di database
        const comment = await commentRepository.createComment(assignmentId, submissionId, userId, text);

        let targetUserId;

        if (submissionId) {
            const submission = await submissionRepository.getSubmissionById(submissionId);
            if (submission) {
                targetUserId = submission.studentId; // Jika komentar di submission, beri notifikasi ke siswa
            } else {
                throw new Error("Submission tidak ditemukan");
            }
        } else if (assignmentId) {
            const assignment = await assignmentRepository.getAssignmentById(assignmentId);
            if (assignment) {
                targetUserId = assignment.teacherId; // Jika komentar di assignment, beri notifikasi ke guru
            } else {
                throw new Error("Assignment tidak ditemukan");
            }
        }

        // Kirim notifikasi jika target user ditemukan
        if (targetUserId) {
            await notificationService.sendNotification(targetUserId, "Anda mendapatkan komentar baru.");
        }

        return comment;
    },

    getCommentsByAssignment: async (assignmentId) => {
        return await commentRepository.findCommentsByAssignment(assignmentId);
    },

    getCommentsBySubmission: async (submissionId) => {
        return await commentRepository.findCommentsBySubmission(submissionId);
    },

};

module.exports = commentService;