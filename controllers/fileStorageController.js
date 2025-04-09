const fileStorageService = require("../services/fileStorageService");

const fileStorageController = {
    addFileToAssignment: async (req, res) => {
        try {
            const userId = req.user.id;
            const files = req.files;
            const payload = {
                userId,
                assignmentId: req.params.assignmentId || req.body.assignmentId,
                schoolId: req.body.schoolId,
                classId: req.body.classId,
                subjectId: req.body.subjectId,
                files,
            };

            const savedFiles = await fileStorageService.addFilesToAssignment(payload);

            return res.status(201).json({
                success: true,
                message: "File berhasil diunggah",
                data: savedFiles,
            });
        } catch (error) {
            console.error("[ERROR] Gagal upload file ke Assignment:", error);
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Terjadi kesalahan",
            });
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

    downloadFile: async (req, res, next) => {
        try {
            const { fileId } = req.params;
            const result = await fileStorageService.downloadFile(fileId, req.user);
            res.download(result.filePath, result.fileName);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = fileStorageController;
