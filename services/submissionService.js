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

    getSubmissionById: async (id) => {
        const submission = await submissionRepository.getSubmissionById(Number(id));
        if (!submission) {
            throw new Error("Submission tidak ditemukan");
        }
        return submission;
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

};

module.exports = submissionService;

// const addCommentToSubmission = async (submissionId, commentData) => {
//     return await submissionRepository.addCommentToSubmission(submissionId, commentData);
// };
