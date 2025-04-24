const assignmentService = require("../services/assignmentService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const assignmentController = {
    createAssignment: async (req, res) => {
        try {
            const newAssignment = await assignmentService.createAssignment(req.body);
            return successResponse(res, 201, "The task was created successfully", newAssignment);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    getAllAssignments: async (req, res) => {
        try {
            const assignments = await assignmentService.getAllAssignments();
            return successResponse(res, 200, "The task was successfully retrieved", assignments);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    getAssignmentById: async (req, res) => {
        try {
            const assignment = await assignmentService.getAssignmentById(req.params.id);
            return successResponse(res, 200, "Task details retrieved successfully", assignment);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    updateAssignment: async (req, res) => {
        try {
            const updatedAssignment = await assignmentService.updateAssignment(req.params.id, req.body);
            return successResponse(res, 200, "The task was updated successfully", updatedAssignment);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    deleteAssignment: async (req, res) => {
        try {
            const assignmentId = Number(req.params.id);
            if (isNaN(assignmentId)) {
                return errorResponse(res, 400, "Invalid assignment ID")
            }
            await assignmentService.deleteAssignment(assignmentId);
            return successResponse(res, 200, "The task was successfully deleted");
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },
};

module.exports = assignmentController;
