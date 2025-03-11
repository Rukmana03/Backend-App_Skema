const submissionService = require("../services/submissionService");

const submissionController = {
    createSubmission: async (req, res) => {
        try {
            const submission = await submissionService.createSubmission(req.body);
            res.status(201).json(submission);
        } catch (error) {
            res.status(400).json({ error: error.message });
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
            const userId = req.user.id; // ID user yang sedang login (dari JWT)
            const userRole = req.user.role; // Role user (Student, Teacher, Admin)

            // Pastikan submission ada
            const submission = await submissionService.getSubmissionById(id);
            if (!submission) {
                return res.status(404).json({ error: "Submission tidak ditemukan" });
            }

            // Pastikan hanya murid yang menghapus submission miliknya
            if (userRole !== "Student" || submission.studentId !== userId) {
                return res.status(403).json({ error: "Anda tidak memiliki izin untuk menghapus submission ini" });
            }

            // Cek deadline tugas
            const assignment = await submissionService.getAssignmentById(submission.assignmentId);
            const now = new Date();
            if (assignment.deadline && new Date(assignment.deadline) < now) {
                return res.status(400).json({ error: "Submission tidak bisa dihapus setelah deadline tugas." });
            }

            // Hapus submission
            await submissionService.deleteSubmission(id);
            res.status(200).json({ message: "Submission berhasil dihapus" });
        } catch (error) {
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
