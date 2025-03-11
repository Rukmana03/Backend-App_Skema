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

        if (submission.status !== "Submitted") {
            throw new Error("Submission must be in 'Submitted' status to be graded");
        }

        const existingGrade = await gradeRepository.getGradeBySubmissionId(submissionId);
        if (existingGrade) {
            throw new Error("This submission has already been graded");
        }

        const newGrade = await gradeRepository.createGrade({
            submissionId,
            teacherId,
            score,
            feedback,
            gradedDate: new Date(),
        });

        await notificationService.sendNotification(submission.studentId, `Tugas Anda telah dinilai dengan skor ${score}.`);

        return newGrade;
    },

    getGradeBySubmissionId: async (submissionId) => {
        const grade = await gradeRepository.getGradeBySubmissionId(submissionId);

        if (!grade) {
            throw new Error("Grade not found");
        }

        return grade;
    },


    updateGrade: async (gradeId, { score, feedback }) => {
        const updatedGrade = await gradeRepository.updateGrade(gradeId, { score, feedback });

        return successResponse(200, "Grade updated successfully", updatedGrade);
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
