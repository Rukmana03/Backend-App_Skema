const gradeService = require("../services/gradeService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const gradeController = {
    createGrade: async (req, res) => {
        try {
            const teacherId = req.user.id;
            const { submissionId, score, feedback } = req.body;

            if (!submissionId || score === undefined) {
                return errorResponse(res, 400, "submissionId dan score wajib diisi.");
            }

            const newGrade = await gradeService.createGrade({ submissionId, teacherId, score, feedback });
            return successResponse(res, 201, "Grade berhasil ditambahkan", newGrade);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal membuat grade");
        }
    },

    getGradeBySubmissionId: async (req, res) => {
        try {
            const { submissionId } = req.params;

            if (!submissionId) {
                return errorResponse(res, 400, "submissionId diperlukan.");
            }

            const grade = await gradeService.getGradeBySubmissionId(Number(submissionId));
            return successResponse(res, 200, "Grade berhasil diambil", grade);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal mengambil grade");
        }
    },

    updateGrade: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return errorResponse(res, 400, "gradeId diperlukan.");
            }

            const updatedGrade = await gradeService.updateGrade(Number(id), req.body);
            return successResponse(res, 200, "Grade berhasil diperbarui", updatedGrade);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal memperbarui grade");
        }
    },

    deleteGrade: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return errorResponse(res, 400, "gradeId diperlukan.");
            }

            await gradeService.deleteGrade(Number(id));
            return successResponse(res, 200, "Grade berhasil dihapus");
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal menghapus grade");
        }
    },

    getGradesByClassId: async (req, res) => {
        try {
            const { classId } = req.params;

            if (!classId) {
                return errorResponse(res, 400, "classId diperlukan.");
            }

            const grades = await gradeService.getGradesByClassId(Number(classId));
            return successResponse(res, 200, "Grades berhasil diambil", grades);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal mengambil grades");
        }
    },

    getGradesByStudentId: async (req, res) => {
        try {
            const { studentId } = req.params;

            if (!studentId) {
                return errorResponse(res, 400, "studentId diperlukan.");
            }

            const grades = await gradeService.getGradesByStudentId(Number(studentId));
            return successResponse(res, 200, "Grades berhasil diambil", grades);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal mengambil grades");
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
            return errorResponse(res, error.status || 500, error.message || "Gagal mengambil grades");
        }
    },

    getMyGrades: async (req, res) => {
        try {
            const grades = await gradeService.getGradesByStudentId(req.user.id);
            return successResponse(res, 200, "Grades berhasil diambil", grades);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal mengambil grades");
        }
    },
};

module.exports = gradeController;
