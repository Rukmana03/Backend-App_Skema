const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fileStorageRepository = {
    createFile: async ({ userId, fileName, fileUrl }) => {
        return await prisma.fileStorage.create({
            data: { userId, fileName, fileUrl, uploadDate: new Date() }
        });
    },

    linkFileToAssignment: async (fileId, assignmentId) => {
        return await prisma.assignmentFile.create({
            data: { fileId, assignmentId }
        });
    },

    linkFileToSubmission: async (fileId, submissionId) => {
        return await prisma.submissionFile.create({
            data: { fileId, submissionId }
        });
    },

    getFileByAssignment: async (fileId, assignmentId) => {
        return await prisma.assignmentFile.findFirst({
            where: { fileId, assignmentId }
        });
    },

    getFilesBySubmission: async (submissionId) => {
        return await prisma.submissionFile.findMany({
            where: { submissionId },
            include: { file: true }
        });
    },

    deleteFile: async (fileId) => {
        return await prisma.fileStorage.delete({
            where: { id: fileId }
        });
    },

    getFileById: async (fileId) => {
        return prisma.fileStorage.findUnique({
            where: { id: fileId },
            include: {
                AssignmentFile: true,
                SubmissionFile: true,
            },
        });
    },
};

module.exports = fileStorageRepository;
