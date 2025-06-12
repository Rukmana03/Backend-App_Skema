const gradeRepository = require("../repositories/gradeRepository");
const submissionRepository = require("../repositories/submissionRepository");
const notificationService = require("./notificationService");
const { createGradeSchema, updateGradeSchema } = require("../validations/gradeValidator");
const { throwError } = require("../utils/responseHandler");

const gradeService = {
    createGrade: async ({ submissionId, teacherId, score, feedback }) => {
        console.log("Validating grade:", { submissionId, score, feedback });
        const { error } = createGradeSchema.validate({ submissionId, score, feedback });
        if (error) throwError(400, error.details[0].message);

        const submission = await submissionRepository.getSubmissionById(submissionId);
        if (!submission) throwError(404, "Submission is not found.");

        if (!submission.assignment || submission.assignment.teacherId !== teacherId) {
            throwError(403, "You can only give value to submissions on your own task.");
        }

        const existingGrade = await gradeRepository.getGradeBySubmissionId(submissionId);
        if (existingGrade) throwError(400, "This submission has been assessed beforehand.");

        if (submission.status !== "Submitted") {
            throwError(400, "Submission must have a 'submitted' status to be assessed.");
        }

        const newGrade = await gradeRepository.createGrade({ submissionId, teacherId, score, feedback });
        await submissionRepository.updateSubmissionStatus(submissionId, "Graded");

        await notificationService.sendNotification({
            userId: submission.studentId,
            message: `Your task has been valued in the score ${score}.`
        });
        console.log("Student sent notif", submission.studentId);
        return newGrade;
    },

    getGradeBySubmissionId: async (submissionId) => {
        const grade = await gradeRepository.getGradeBySubmissionId(submissionId);
        if (!grade) throwError(404, "Grade is not found.");
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
        if (!existingGrade) throwError(404, "Grade is not found.");

        const updatedGrade = await gradeRepository.updateGrade(gradeId, { score, feedback });
        await submissionRepository.updateSubmissionStatus(existingGrade.submissionId, "Graded");

        return updatedGrade;
    },

    deleteGrade: async (gradeId) => {
        const grade = await gradeRepository.getGradeById(gradeId);
        if (!grade) {
            throwError(404, "Grade not found");
        }
        await submissionRepository.updateSubmissionStatus(grade.submissionId, "Submitted");
        await gradeRepository.deleteGrade(gradeId);
        return ;
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
