const assignmentService = require("../services/assignmentService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const assignmentController = {
    createAssignment: async (req, res) => {
        try {
            const newAssignment = await assignmentService.createAssignment(req.body);
            return successResponse(res, 201, "Tugas berhasil dibuat", newAssignment);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Terjadi kesalahan saat membuat tugas");
        }
    },

    getAllAssignments: async (req, res) => {
        try {
            const assignments = await assignmentService.getAllAssignments();
            return successResponse(res, 200, "Tugas berhasil diambil", assignments);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Terjadi kesalahan saat mengambil tugas");
        }
    },

    getAssignmentById: async (req, res) => {
        try {
            const assignment = await assignmentService.getAssignmentById(req.params.id);
            return successResponse(res, 200, "Detail tugas berhasil diambil", assignment);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Terjadi kesalahan saat mengambil detail tugas");
        }
    },

    updateAssignment: async (req, res) => {
        try {
            const updatedAssignment = await assignmentService.updateAssignment(req.params.id, req.body);
            return successResponse(res, 200, "Tugas berhasil diperbarui", updatedAssignment);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Terjadi kesalahan saat memperbarui tugas");
        }
    },

    deleteAssignment: async (req, res) => {
        try {
            await assignmentService.deleteAssignment(req.params.id);
            return successResponse(res, 200, "Tugas berhasil dihapus");
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Terjadi kesalahan saat menghapus tugas");
        }
    },
};

module.exports = assignmentController;
