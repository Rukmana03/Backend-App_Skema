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

        await fileStorageRepository.linkFileToAssignment(file.id, assignmentId);

        return file;
    },

    addFileToSubmission: async ({ submissionId, userId, fileName, fileUrl }) => {
        const submission = await submissionRepository.getSubmissionById(submissionId);
        if (!submission) {
            throw new Error("Submission tidak ditemukan.");
        }

        const file = await fileStorageRepository.createFile({ userId, fileName, fileUrl });

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
        return await fileStorageRepository.deleteFile(fileId);
    }
};

module.exports = fileStorageService;
