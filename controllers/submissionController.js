const { response } = require("express");
const submissionService = require("../services/submissionService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const submissionController = {
    createSubmission: async (req, res) => {
        try {
            console.log("[DEBUG] Request masuk ke createSubmission:", req.body);

            const { assignmentId, studentId, fileUrl } = req.body;

            // 🔹 Panggil service untuk memproses submission
            const submission = await submissionService.createSubmission({ assignmentId, studentId, fileUrl });

            console.log("[DEBUG] Submission berhasil dibuat:", submission);
            res.status(201).json({ success: true, data: submission });

        } catch (error) {
            console.error("[ERROR] Gagal membuat submission:", error);
            res.status(500).json({ error: error.message || "Terjadi kesalahan saat mengirim submission." });
        }
    },

    getSubmissionById: async (req, res) => {
        try {
            const submission = await submissionService.getSubmissionById(parseInt(req.params.id));
            res.status(200).json(submission);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    getAllSubmissions: async (req, res) => {
        try {
            const response = await submissionService.getAllSubmissions();
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateSubmission: async (req, res) => {
        try {
            const updatedSubmission = await submissionService.updateSubmission(parseInt(req.params.id), req.body);
            res.status(200).json(updatedSubmission);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteSubmission: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            // 🔹 Cek apakah submission ada
            const submissionResponse = await submissionService.getSubmissionById(id);
            const submission = submissionResponse.data; // 🔹 Ambil `data` dari response

            if (!submission) {
                return res.status(404).json({ error: "Submission tidak ditemukan" });
            }

            // 🔹 Pastikan hanya pemilik submission yang bisa menghapusnya
            if (userRole === "Student" && submission.studentId !== userId) {
                console.error("[ERROR] User tidak memiliki izin menghapus submission ini!");
                return res.status(403).json({ error: "Anda hanya bisa menghapus submission milik Anda sendiri." });
            }

            // 🔹 Cek deadline tugas
            const assignment = await submissionService.getAssignmentById(submission.assignmentId);
            const now = new Date();
            if (assignment.deadline && new Date(assignment.deadline) < now) {
                return res.status(400).json({ error: "Submission tidak bisa dihapus setelah deadline tugas." });
            }

            await submissionService.deleteSubmission(id);

            res.status(200).json({ message: "Submission berhasil dihapus." });

        } catch (error) {
            console.error("[ERROR] Gagal menghapus submission:", error);
            res.status(500).json({ error: error.message });
        }
    },

    submitSubmission: async (req, res) => {
        try {
            const studentId = req.user.id; // Dapatkan ID student dari token JWT
            const assignmentId = Number(req.params.id);
            
            const submission = await submissionService.submitSubmission({ assignmentId, studentId });

            res.status(201).json({ success: true, message: "Submission berhasil dikirim", data: submission });
        } catch (error) {
            console.error("[ERROR] Gagal mengirim submission:", error);
            res.status(500).json({ error: error.message });
        }
    },

};

module.exports = submissionController;

// const addCommentToSubmission = async (req, res) => {
//     try {
//         const { id } = req.params; // ID submission
//         const { content } = req.body; // Isi komentar
//         const userId = req.user.id; // ID user dari token

//         if (!id) {
//             return res.status(400).json({ error: "Submission ID tidak ditemukan di URL." });
//         }

//         if (!userId) {
//             return res.status(401).json({ error: "Unauthorized. User ID tidak ditemukan." });
//         }

//         if (!content || content.trim() === "") {
//             return res.status(400).json({ error: "Komentar tidak boleh kosong." });
//         }

//         // Pastikan submission ada
//         const submission = await submissionService.getSubmissionById(id);
//         if (!submission) {
//             return res.status(404).json({ error: "Submission tidak ditemukan." });
//         }

//         const comment = await submissionService.addCommentToSubmission(id, {
//             content,
//             userId,
//             assignmentId: submission.assignmentId, // Ambil `assignmentId` dari submission
//         });

//         res.status(201).json({ message: "Komentar berhasil ditambahkan.", comment });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: error.message });
//     }
// };
