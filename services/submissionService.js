const submissionRepository = require("../repositories/submissionRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const notificationService = require("../services/notificationService")

const submissionService = {
    createSubmission: async (data) => {
        if (!data.assignmentId || !data.studentId || !data.fileUrl) {
            throw new Error("assignmentId, studentId, dan fileUrl harus diisi");
        }

        const submission = await submissionRepository.createSubmission(data);

        const assignment = await assignmentRepository.getAssignmentById(data.assignmentId);
        if (assignment) {
            await notificationService.sendNotification(assignment.teacherId, `Siswa mengirim tugas untuk "${assignment.title}".`);
        }

        return submission;
    },

    getAllSubmissions: async () => {
        const submissions = await submissionRepository.getAllSubmissions();
        return {
            message: "Submissions retrieved successfully",
            data: submissions
        };
    },

    getSubmissionById: async (id) => {
        const submissions = await submissionRepository.getSubmissionById(Number(id));
        if (!submissions) {
            throw new Error("Submission not found");
        }
        return {
            message: "Submission retrieved successfully",
            data: submissions
        };
    },

    updateSubmission: async (id, data) => {
        // Ambil submission dengan assignment-nya
        const existingSubmission = await submissionRepository.getSubmissionById(id);
        if (!existingSubmission) {
            throw new Error("Submission tidak ditemukan");
        }

        // Cek apakah assignment terkait ada
        if (!existingSubmission.assignment) {
            throw new Error("Assignment terkait tidak ditemukan");
        }

        // Cek apakah deadline sudah lewat
        const deadline = new Date(existingSubmission.assignment.deadline);
        const now = new Date();
        if (now > deadline) {
            throw new Error("Tidak bisa mengupdate, deadline sudah lewat");
        }

        // Update submission
        return await submissionRepository.updateSubmission(id, data);
    },

    getAssignmentById: async (assignmentId) => {
        return await assignmentRepository.getAssignmentById(assignmentId);
    },

    deleteSubmission: async (id) => {
        return await submissionRepository.deleteSubmission(Number(id));
    },

    submitSubmission: async ({ assignmentId, studentId }) => {
        console.log("[DEBUG] Mulai proses submission...", { assignmentId, studentId });

        assignmentId = Number(assignmentId); // Konversi ke number
        if (isNaN(assignmentId)) {
            throw new Error("assignmentId harus berupa angka yang valid.");
        }

        // 🔹 1. Pastikan submission sudah ada dalam status "Pending"
        const existingSubmission = await submissionRepository.findSubmissionByStudent(assignmentId, studentId);
        if (!existingSubmission) {
            throw new Error("Submission belum dibuat. Harap buat submission terlebih dahulu sebelum mengirim.");
        }

        // 🔹 2. Pastikan submission memiliki file sebelum bisa disubmit
        if (!existingSubmission.fileUrl) {
            throw new Error("Submission harus memiliki file sebelum bisa dikirim.");
        }

        // 🔹 3. Cek apakah assignment ada
        const assignment = await assignmentRepository.getAssignmentById(assignmentId);
        if (!assignment) {
            throw new Error("Assignment tidak ditemukan.");
        }

        // 🔹 4. Cek apakah deadline ada dan valid
        if (!assignment.deadline) {
            throw new Error("Assignment belum memiliki deadline.");
        }

        const now = new Date();
        const deadlineDate = new Date(assignment.deadline);

        if (isNaN(deadlineDate.getTime())) {
            throw new Error("Format deadline tidak valid.");
        }

        if (deadlineDate < now) {
            throw new Error("Deadline sudah lewat, tidak bisa submit.");
        }

        // 🔹 5. Ubah status submission menjadi "Submitted"
        const submission = await submissionRepository.updateSubmissionStatus(existingSubmission.id, "Submitted");

        console.log("[DEBUG] Submission berhasil dikirim:", submission);
        return submission;
    },

};

module.exports = submissionService;

// const addCommentToSubmission = async (submissionId, commentData) => {
//     return await submissionRepository.addCommentToSubmission(submissionId, commentData);
// };
