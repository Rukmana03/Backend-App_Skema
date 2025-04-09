const gradeRepository = require("../repositories/gradeRepository");
const submissionRepository = require("../repositories/submissionRepository");
const notificationService = require("./notificationService");
const { createGradeSchema, updateGradeSchema } = require("../validations/gradeValidator");
const { throwError } = require("../utils/responseHandler");

const gradeService = {
    createGrade: async ({ submissionId, teacherId, score, feedback }) => {
        const { error } = createGradeSchema.validate({ submissionId, teacherId, score, feedback });
        if (error) throwError(400, error.details[0].message);

        const submission = await submissionRepository.getSubmissionById(submissionId);
        if (!submission) throwError(404, "Submission tidak ditemukan.");

        if (!submission.assignment || submission.assignment.teacherId !== teacherId) {
            throwError(403, "Anda hanya dapat memberi nilai untuk submission pada tugas Anda sendiri.");
        }

        const existingGrade = await gradeRepository.getGradeBySubmissionId(submissionId);
        if (existingGrade) throwError(400, "Submission ini sudah dinilai sebelumnya.");

        if (submission.status !== "Submitted") {
            throwError(400, "Submission harus memiliki status 'Submitted' untuk dinilai.");
        }

        const newGrade = await gradeRepository.createGrade({ submissionId, teacherId, score, feedback });
        await submissionRepository.updateSubmissionStatus(submissionId, "Graded");

        await notificationService.sendNotification(
            submission.studentId,
            `Tugas Anda telah dinilai dengan skor ${score}.`
        );

        return newGrade;
    },

    getGradeBySubmissionId: async (submissionId) => {
        const grade = await gradeRepository.getGradeBySubmissionId(submissionId);
        if (!grade) throwError(404, "Grade tidak ditemukan.");
        return {
            id: grade.id,
            score: grade.score,
            feedback: grade.feedback,
            teacher: grade.teacher
        };
    },

    updateGrade: async (gradeId, { score, feedback }) => {
        const { error } = updateGradeSchema.validate({ score, feedback });
        if (error) throwError(400, error.details[0].message);

        const existingGrade = await gradeRepository.getGradeById(gradeId);
        if (!existingGrade) throwError(404, "Grade tidak ditemukan.");

        const updatedGrade = await gradeRepository.updateGrade(gradeId, { score, feedback });
        await submissionRepository.updateSubmissionStatus(existingGrade.submissionId, "Graded");

        return updatedGrade;
    },

    deleteGrade: async (gradeId) => {
        await gradeRepository.deleteGrade(gradeId);
        return { message: "Grade berhasil dihapus." };
    },

    getGradesByClassId: async (classId) => {
        return await gradeRepository.getGradesByClassId(classId);
    },

    getGradesByStudentId: async (studentId) => {
        return await gradeRepository.getGradesByStudentId(studentId);
    },

    getGradesByAssignmentId: async (assignmentId) => {
        return await gradeRepository.getGradesByAssignmentId(assignmentId);
    },
};

module.exports = gradeService;
