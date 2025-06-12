const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const commentRepository = {
    createComment: async ({ assignmentId, submissionId, userId, text }) => {
        return await prisma.comment.create({
            data: {
                assignmentId,
                submissionId,
                userId,
                content: text
            }
        });
    },

    findCommentsByAssignment: async (assignmentId) => {
        return await prisma.comment.findMany({
            where: { assignmentId },
            select: {
                id: true,
                content: true,
                commentDate: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profile: {
                            select: {
                                name: true
                            },
                        },
                    },
                },
            },
        });
    },

    findCommentsBySubmission: async (submissionId) => {
        return await prisma.comment.findMany({
            where: { submissionId },
            select: {
                id: true,
                content: true,
                commentDate: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profile: {
                            select: {
                                name: true
                            },
                        },
                    },
                },
            },
        });
    },

    findCommentById: async (commentId) => {
        return await prisma.comment.findUnique({
            where: {
                id: Number(commentId)
            },
            select: {
                id: true,
                content: true,
                commentDate: true,
                assignmentId: true,
                submissionId: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profile: {
                            select: {
                                name: true
                            },
                        },
                    },
                },
            },
        });
    },

    updateComment: async (commentId, updateData) => {
        return await prisma.comment.update({
            where: {
                id: Number(commentId)
            },
            data: updateData,
        });
    },

    deleteComment: async (commentId) => {
        return await prisma.comment.delete({
            where: {
                id: Number(commentId)
            },
        });
    },
};

module.exports = commentRepository;
