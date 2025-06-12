const fileStorageRepository = require("../repositories/fileStorageRepository");
const fileStorageService = require("../services/fileStorageService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const fileStorageController = {
    addFileToAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.body;
            const currentUser = req.user;
            const files = req.files;
            const savedFiles = await fileStorageService.addFilesToAssignment(assignmentId, currentUser, files);
            return successResponse(res, 200, "The file was successfully uploaded", savedFiles);
        } catch (error) {
            console.log("Error");
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    getFilesByAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const files = await fileStorageService.getFilesByAssignment(Number(assignmentId));
            return successResponse(res, 200, "Files retrieved successfully", files);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    getFilesBySubmission: async (req, res) => {
        try {
            const { submissionId } = req.params;
            const files = await fileStorageService.getFilesBySubmission(Number(submissionId));
            return successResponse(res, 200, "Files retrieved successfully", files);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    deleteFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            await fileStorageService.deleteFile(Number(fileId));
            return successResponse(res, 200, "File deleted successfully");
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    downloadFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            const user = req.user;
            const {fileName, filePath} = await fileStorageService.downloadFile(Number(fileId), user);
            res.download(filePath, fileName);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Failed to download file");
        }
    },
};

module.exports = fileStorageController;
