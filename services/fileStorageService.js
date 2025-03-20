const fileStorageRepository = require("../repositories/fileStorageRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const submissionRepository = require("../repositories/submissionRepository");

const fileStorageService = {
    addFileToAssignment: async ({ assignmentId, userId, fileName, fileUrl }) => {
        const assignment = await assignmentRepository.getAssignmentById(assignmentId);
        if (!assignment) {
            throw new Error("Assignment tidak ditemukan.");
        }

        const file = await fileStorageRepository.createFile({ userId, fileName, fileUrl });

        const existingFile = await fileStorageRepository.linkFileToAssignment( fileName, assignmentId);
        if (existingFile) {
            throw new Error("File sudah terhubung ke Assignment ini.");
        }

        await fileStorageRepository.linkFileToAssignment(file.id, assignmentId);

        return file;
    },

    addFileToSubmission: async ({ submissionId, userId, fileName, fileUrl }) => {
        const submission = await submissionRepository.getSubmissionById(submissionId);
        if (!submission) {
            throw new Error("Submission tidak ditemukan.");
        }

        const file = await fileStorageRepository.createFile({ userId, fileName, fileUrl });

        const existingFile = await fileStorageRepository.linkFileToSubmission(file.id, submissionId);
        if (existingFile) {
            throw new Error("File sudah terhubung ke Submission ini.");
        }

        await fileStorageRepository.linkFileToSubmission(file.id, submissionId);

        return file;
    },

    getFilesByAssignment: async (assignmentId) => {
        return await fileStorageRepository.getFilesByAssignment(assignmentId);
    },

    getFilesBySubmission: async (submissionId) => {
        return await fileStorageRepository.getFilesBySubmission(submissionId);
    },

    deleteFile: async (fileId) => {
        const file = await fileStorageRepository.getFileById(fileId);
        if (!file) {
            throw new Error("File tidak ditemukan.");
        }
        await fileStorageRepository.deleteFile(fileId);
        return { message: "File berhasil dihapus." };
    },
};

module.exports = fileStorageService;
