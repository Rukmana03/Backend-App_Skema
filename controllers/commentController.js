const commentService = require("../services/commentService");
const assignmentRepository = require("../repositories/assignmentRepository");
const submissionRepository = require("../repositories/submissionRepository");

const commentController = {
    // 🔹 Tambah komentar ke assignment (Hanya Teacher)
    addCommentToAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const { text } = req.body;
            const userId = req.user.id; // Ambil dari req.user

            // Validasi input
            if (!text) {
                return res.status(400).json({ success: false, message: "Komentar tidak boleh kosong" });
            }

            // Cek apakah assignment ada
            const assignment = await assignmentRepository.getAssignmentById(assignmentId);
            if (!assignment) {
                return res.status(404).json({ success: false, message: "Assignment tidak ditemukan" });
            }

            // Pastikan hanya Teacher yang bisa memberi komentar
            if (req.user.role !== "Teacher") {
                return res.status(403).json({ success: false, message: "Hanya Teacher yang boleh memberi komentar pada tugas" });
            }

            // Tambahkan komentar
            const comment = await commentService.addComment(assignmentId, null, userId, text);

            return res.status(201).json({ success: true, message: "Komentar berhasil ditambahkan", data: comment });
        } catch (error) {
            console.error("Error in addCommentToAssignment:", error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan", error: error.message || "Unknown error" });
        }
    },

    // 🔹 Ambil komentar dari assignment
    getCommentsByAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const response = await commentService.getCommentsByAssignment(assignmentId);
            return res.status(200).json(response);
        } catch (error) {
            console.error("Error in getCommentsByAssignment:", error);
            return res.status(500).json({ message: "Terjadi kesalahan", error: error.message || "Unknown error" });
        }
    },

    // 🔹 Tambah komentar ke submission (Bisa oleh Teacher atau Murid)
    addCommentToSubmission: async (req, res) => {
        try {
            const { submissionId } = req.params;
            const { text } = req.body;
            const userId = req.user.id; // Ambil dari req.user

            // Validasi input
            if (!text) {
                return res.status(400).json({ success: false, message: "Komentar tidak boleh kosong" });
            }

            // Pastikan submission ada
            const submission = await submissionRepository.getSubmissionById(submissionId);
            if (!submission) {
                return res.status(404).json({ success: false, message: "Submission tidak ditemukan" });
            }

            // Tambahkan komentar ke submission
            const comment = await commentService.addComment(null, submissionId, userId, text);

            return res.status(201).json({ success: true, message: "Komentar berhasil ditambahkan", data: comment });
        } catch (error) {
            console.error("Error in addCommentToSubmission:", error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan", error: error.message || "Unknown error" });
        }
    },

    // 🔹 Ambil komentar dari submission
    getCommentsBySubmission: async (req, res) => {
        try {
            const { submissionId } = req.params;
            const response = await commentService.getCommentsBySubmission(submissionId);
            return res.status(200).json(response);
        } catch (error) {
            console.error("Error in getCommentsBySubmission:", error);
            return res.status(500).json({ message: "Terjadi kesalahan", error: error.message || "Unknown error" });
        }
    },

};

module.exports = commentController;
