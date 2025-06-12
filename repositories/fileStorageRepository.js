const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fileStorageRepository = {
    createFile: async ({ userId, fileName, fileUrl }) => {
        return await prisma.fileStorage.create({
            data: { userId, fileName, fileUrl, uploadDate: new Date() }
        });
    },

    createManyFiles: async (files) => {
        return await prisma.fileStorage.createMany({
            data: files.map((file) => ({
                userId: file.userId,
                fileName: file.fileName,
                fileUrl: file.fileUrl,
                fileType: file.fileType,
                submissionId: file.submissionId,
                assignmentId: file.assignmentId,
                uploadDate: file.uploadDate,
            })),
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
                assignment: true,
                submission: true,
            },
        });
    },

    getFilesByAssignment: async (assignmentId) => {
        return prisma.fileStorage.findMany({
            where: { assignmentId },
        });
    },

    getFilesBySubmission: async (submissionId) => {
        return prisma.fileStorage.findMany({
            where: { submissionId },
        });
    },
};

module.exports = fileStorageRepository;
