const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const commentRepository = {
    createComment: async (data) => {
        return await prisma.comment.create({ data });
    },

    findCommentsByAssignment: async (assignmentId) => {
        return await prisma.comment.findMany({
            where: { assignmentId },
            include: { user: true },
        });
    },

    findCommentsBySubmission: async (submissionId) => {
        return await prisma.comment.findMany({
            where: { submissionId },
            include: { user: true },
        });
    },
};

module.exports = commentRepository;
