const gradeRepository = require("../repositories/gradeRepository");
const submissionRepository = require("../repositories/submissionRepository");
const notificationService = require("../services/notificationService")
const { throwError, successResponse } = require("../utils/responeHandler");

const gradeService = {
    createGrade: async ({ submissionId, teacherId, score, feedback }) => {
        const submission = await submissionRepository.getSubmissionById(submissionId);

        if (!submission) {
            throw new Error("Submission not found");
        }

        console.log("[DEBUG] Teacher yang login:", teacherId);
        console.log("[DEBUG] Teacher yang membuat assignment:", submission.assignment?.teacherId);

        if (!submission.assignment || submission.assignment.teacherId !== teacherId) {
            throw new Error("You can only grade submissions from your own assignments.");
        }

        const existingGrade = await gradeRepository.getGradeBySubmissionId(submissionId);
        if (existingGrade) {
            throw new Error("This submission has already been graded");
        }

        if (!["Submitted"].includes(submission.status)) {
            throw new Error("Submission must be in 'Submitted' status to be graded.");
        }

        console.log("[DEBUG] Submission siap dinilai.");

        const newGrade = await gradeRepository.createGrade({
            submissionId,
            teacherId,
            score,
            feedback,
            gradedDate: new Date(),
        });

        console.log("[DEBUG] Grade berhasil dibuat:", newGrade);

        await submissionRepository.updateSubmissionStatus(submissionId, "Graded");

        console.log("[DEBUG] Status submission berhasil diperbarui menjadi 'Graded'.");

        await notificationService.sendNotification(submission.studentId, `Tugas Anda telah dinilai dengan skor ${score}.`);

        return newGrade;
    },

    getGradeBySubmissionId: async (submissionId) => {
        const grade = await gradeRepository.getGradeBySubmissionId(submissionId);

        if (!grade) {
            throw new Error("Grade not found");
        }

        return { "id": grade.id, "score": grade.score, "feedback": grade.feedback, "teacher": grade.teacher };
        // return grade;
    },

    updateGrade: async (gradeId, { score, feedback }) => {
        console.log("[DEBUG] Memulai update grade untuk gradeId:", gradeId);

        // 🔹 1. Cek apakah grade ada sebelum update
        const existingGrade = await gradeRepository.getGradeById(gradeId);
        if (!existingGrade) {
            throw new Error("Grade not found");
        }

        // 🔹 2. Update grade
        const updatedGrade = await gradeRepository.updateGrade(gradeId, { score, feedback });
        console.log("[DEBUG] Grade berhasil diperbarui:", updatedGrade);

        // 🔹 3. **Update status submission menjadi "Graded"**
        console.log("[DEBUG] Mengupdate status submission ke 'Graded' untuk submissionId:", existingGrade.submissionId);
        await submissionRepository.updateSubmissionStatus(existingGrade.submissionId, "Graded");

        return updatedGrade;
    },

    deleteGrade: async (gradeId) => {
        await gradeRepository.deleteGrade(gradeId);
        return successResponse(200, "Grade deleted successfully");
    },

    getGradesByClassId: async (classId) => {
        const grades = await gradeRepository.getGradesByClassId(classId);
        return successResponse(200, "Grades retrieved successfully", grades);
    },

    getGradesByStudentId: async (studentId) => {
        const grades = await gradeRepository.getGradesByStudentId(studentId);
        return successResponse(200, "Grades retrieved successfully", grades);
    },

    getGradesByAssignmentId: async (assignmentId) => {
        const grades = await gradeRepository.getGradesByAssignmentId(assignmentId);
        return successResponse(200, "Grades retrieved successfully", grades);
    },
};

module.exports = gradeService;
