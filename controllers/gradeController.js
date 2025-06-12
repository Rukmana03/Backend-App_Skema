const gradeService = require("../services/gradeService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const gradeController = {
    createGrade: async (req, res) => {
        try {
            const teacherId = req.user.id;
            const { submissionId, score, feedback } = req.body;

            if (!submissionId || score === undefined) {
                return errorResponse(res, 400, "Submissionids and scores must be filled in.");
            }
            const newGrade = await gradeService.createGrade({ submissionId, teacherId, score, feedback });
            return successResponse(res, 201, "Grade successfully added", newGrade);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    getGradeBySubmissionId: async (req, res) => {
        try {
            const { submissionId } = req.params;
            if (!submissionId) {
                return errorResponse(res, 400, "submissions are needed.");
            }
            const grade = await gradeService.getGradeBySubmissionId(Number(submissionId));
            return successResponse(res, 200, "Grade was successfully taken", grade);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    updateGrade: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return errorResponse(res, 400, "gradeId required.");
            }
            const updatedGrade = await gradeService.updateGrade(Number(id), req.body);
            return successResponse(res, 200, "Grade was successfully updated", updatedGrade);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    deleteGrade: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return errorResponse(res, 400, "gradeId required.");
            }
            await gradeService.deleteGrade(Number(id));
            return successResponse(res, 200, "Grade was successfully deleted");
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    getGradesByClassId: async (req, res) => {
        try {
            const { classId } = req.params;
            if (!classId) {
                return errorResponse(res, 400, "classId required.");
            }
            const grades = await gradeService.getGradesByClassId(Number(classId));
            return successResponse(res, 200, "Grade was successfully taken", grades);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    getGradesByStudentId: async (req, res) => {
        try {
            const { studentId } = req.params;
            if (!studentId) {
                return errorResponse(res, 400, "studentId required.");
            }
            const grades = await gradeService.getGradesByStudentId(Number(studentId));
            return successResponse(res, 200, "Grade was successfully taken", grades);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    getGradesByAssignmentId: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            if (!assignmentId) {
                return errorResponse(res, 400, "assignmentId diperlukan.");
            }
            const grades = await gradeService.getGradesByAssignmentId(Number(assignmentId));
            return successResponse(res, 200, "Grades berhasil diambil", grades);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },

    getMyGrades: async (req, res) => {
        try {
            const grades = await gradeService.getGradesByStudentId(req.user.id);
            return successResponse(res, 200, "Grade was successfully taken", grades);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
        }
    },
};

module.exports = gradeController;
