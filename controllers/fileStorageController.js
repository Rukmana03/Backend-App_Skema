const fileStorageService = require("../services/fileStorageService");

const fileStorageController = {
    addFileToAssignment: async (req, res) => {
        try {
            console.log("[DEBUG] Isi req.file:", req.file); // 🔹 Tambahkan ini untuk debugging
            const { assignmentId } = req.params;
            const userId = req.user.id;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ success: false, message: "File harus diunggah!" });
            }

            const fileData = {
                assignmentId: Number(assignmentId),
                userId,
                fileName: file.originalname,
                fileUrl: `/uploads/assignments/${file.filename}`, // Simpan path
            };

            const savedFile = await fileStorageService.addFileToAssignment(fileData);
            return res.status(201).json({ success: true, message: "File berhasil diunggah", data: savedFile });
        } catch (error) {
            console.error("Error upload file ke Assignment:", error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan", error: error.message });
        }
    },

    addFileToSubmission: async (req, res) => {
        try {
            const { submissionId } = req.params;
            const userId = req.user.id;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ success: false, message: "File harus diunggah!" });
            }

            const fileData = {
                submissionId: Number(submissionId),
                userId,
                fileName: file.originalname,
                fileUrl: `/uploads/submissions/${file.filename}`, // Simpan path
            };

            const savedFile = await fileStorageService.addFileToSubmission(fileData);
            return res.status(201).json({ success: true, message: "File berhasil diunggah", data: savedFile });
        } catch (error) {
            console.error("Error upload file ke Submission:", error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan", error: error.message });
        }
    },

    getFilesByAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const files = await fileStorageService.getFilesByAssignment(Number(assignmentId));

            if (!files.length) {
                return res.status(404).json({ success: false, message: "Tidak ada file dalam assignment ini." });
            }

            return res.status(200).json({ success: true, message: "File ditemukan", data: files });
        } catch (error) {
            console.error("Error getFilesByAssignment:", error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan", error: error.message });
        }
    },

    getFilesBySubmission: async (req, res) => {
        try {
            const { submissionId } = req.params;
            const files = await fileStorageService.getFilesBySubmission(Number(submissionId));

            if (!files.length) {
                return res.status(404).json({ success: false, message: "Tidak ada file dalam submission ini." });
            }

            return res.status(200).json({ success: true, message: "File ditemukan", data: files });
        } catch (error) {
            console.error("Error getFilesBySubmission:", error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan", error: error.message });
        }
    },

    deleteFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            await fileStorageService.deleteFile(Number(fileId));

            return res.status(200).json({ success: true, message: "File berhasil dihapus" });
        } catch (error) {
            console.error("Error deleteFile:", error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan", error: error.message });
        }
    },
};

module.exports = fileStorageController;
