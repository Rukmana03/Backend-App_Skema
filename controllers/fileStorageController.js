const fileStorageService = require("../services/fileStorageService");

const fileStorageController = {
    addFileToAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const { fileName, fileUrl } = req.body;
            const userId = req.user.id; // Dari middleware autentikasi

            const file = await fileStorageService.addFileToAssignment({ assignmentId, userId, fileName, fileUrl });
            return res.status(201).json({ success: true, message: "File berhasil ditambahkan ke Assignment", data: file });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Gagal menambahkan file", error: error.message });
        }
    },

    addFileToSubmission: async (req, res) => {
        try {
            const { submissionId } = req.params;
            const { fileName, fileUrl } = req.body;
            const userId = req.user.id;

            const file = await fileStorageService.addFileToSubmission({ submissionId, userId, fileName, fileUrl });
            return res.status(201).json({ success: true, message: "File berhasil ditambahkan ke Submission", data: file });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Gagal menambahkan file", error: error.message });
        }
    },

    getFilesByAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const files = await fileStorageService.getFilesByAssignment(assignmentId);
            return res.status(200).json({ success: true, message: "Files berhasil diambil", data: files });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Gagal mengambil files", error: error.message });
        }
    },

    getFilesBySubmission: async (req, res) => {
        try {
            const { submissionId } = req.params;
            const files = await fileStorageService.getFilesBySubmission(submissionId);
            return res.status(200).json({ success: true, message: "Files berhasil diambil", data: files });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Gagal mengambil files", error: error.message });
        }
    },

    deleteFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            await fileStorageService.deleteFile(fileId);
            return res.status(200).json({ success: true, message: "File berhasil dihapus" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Gagal menghapus file", error: error.message });
        }
    }
};

module.exports = fileStorageController;
