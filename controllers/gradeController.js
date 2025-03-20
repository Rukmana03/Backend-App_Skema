const gradeService = require("../services/gradeService");

const gradeController = {
    createGrade: async (req, res) => {
        try {
            const newGrade = await gradeService.createGrade(req.body);
            res.status(201).json({ message: "Grade successfully added", data: newGrade });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getGradeBySubmissionId: async (req, res) => {
        try {
            const { submissionId } = req.params;
            const grade = await gradeService.getGradeBySubmissionId(Number(submissionId));
            res.status(200).json({ message: "Grade retrieved successfully", data: grade });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    updateGrade: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedGrade = await gradeService.updateGrade(Number(id), req.body);
            res.status(200).json({ message: "Grade updated successfully", data: updatedGrade });
        } catch (error) {
            console.error("[ERROR] Gagal mengupdate grade:", error.message);
            res.status(500).json({ message: "Gagal mengupdate grade", error: error.message });
        }
    },

    deleteGrade: async (req, res) => {
        try {
            const { id } = req.params;
            await gradeService.deleteGrade(Number(id));
            res.status(200).json({ message: "Grade deleted successfully" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getGradesByClassId: async (req, res, next) => {
        try {
            const { classId } = req.params;
            const response = await gradeService.getGradesByClassId(Number(classId));
            res.status(response.status).json(response);
        } catch (error) {
            next(error);
        }
    },

    getGradesByStudentId: async (req, res, next) => {
        try {
            const { studentId } = req.params;
            const response = await gradeService.getGradesByStudentId(Number(studentId));
            res.status(response.status).json(response);
        } catch (error) {
            next(error);
        }
    },

    getGradesByAssignmentId: async (req, res, next) => {
        try {
            const { assignmentId } = req.params;
            const response = await gradeService.getGradesByAssignmentId(Number(assignmentId));
            res.status(response.status).json(response);
        } catch (error) {
            next(error);
        }
    },

    getMyGrades: async (req, res, next) => {
        try {
            const response = await gradeService.getGradesByStudentId(req.user.id);
            res.status(response.status).json(response);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = gradeController;
