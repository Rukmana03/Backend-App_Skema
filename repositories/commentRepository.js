const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const commentRepository = {
    createComment: async (assignmentId, submissionId, userId, text) => {
        return await prisma.comment.create({
            data: {
                assignmentId: assignmentId ? Number(assignmentId): null, // Pastikan tidak undefined
                submissionId: submissionId ? Number(submissionId) : null, // Pastikan tidak undefined
                userId: Number(userId),
                content: text,
            },
        });
    },

    findCommentsByAssignment: async (assignmentId) => {
        return await prisma.comment.findMany({
            where: { assignmentId: Number(assignmentId) || null, },
            include: { user: true },
        });
    },

    findCommentsBySubmission: async (submissionId) => {
        return await prisma.comment.findMany({
            where: { submissionId: Number(submissionId) || null, },
            include: { user: true },
        });
    },

};

module.exports = commentRepository;