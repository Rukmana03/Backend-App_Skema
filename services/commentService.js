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
        const comments = await commentRepository.findCommentsByAssignment(assignmentId);

        if (!comments || comments.length === 0) {
            return { success: true, message: "Tidak ada komentar ditemukan", data: [] };
        }

        // 🔹 Filter data sebelum mengembalikan respons
        const formattedComments = comments.map(comment => ({
            id: comment.id,
            userId: comment.userId,
            submissionId: comment.submissionId,
            assignmentId: comment.assignmentId,
            type: comment.assignmentId ? "Assignment" : "Submission",
            content: comment.content,
            commentDate: comment.commentDate,
            user: {
                id: comment.user.id,
                username: comment.user.username,
                role: comment.user.role
            }
        }));

        return { message: "Komentar berhasil diambil", data: formattedComments };
    },

    getCommentsBySubmission: async (submissionId) => {
        const comments = await commentRepository.findCommentsBySubmission(submissionId);

        if (!comments || comments.length === 0) {
            return { success: true, message: "Tidak ada komentar ditemukan", data: [] };
        }

        const formattedComments = comments.map(comment => ({
            id: comment.id,
            userId: comment.userId,
            submissionId: comment.submissionId,
            assignmentId: comment.assignmentId,
            type: comment.assignmentId ? "Assignment" : "Submission",
            content: comment.content,
            commentDate: comment.commentDate,
            user: {
                id: comment.user.id,
                username: comment.user.username,
                role: comment.user.role
            }
        }));

        return { success: true, message: "Komentar berhasil diambil", data: formattedComments };
    },

};

module.exports = commentService;