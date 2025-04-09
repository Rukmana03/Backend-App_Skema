const schoolService = require("../services/schoolService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const schoolController = {
    createSchool: async (req, res) => {
        try {
            const school = await schoolService.createSchool(req.body);
            return successResponse(res, 201, "School created successfully", school);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    updateSchool: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedSchool = await schoolService.updateSchool(id, req.body);
            return successResponse(res, 200, "School updated successfully", updatedSchool);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message || "Failed to update school");
        }
    },

    deleteSchool: async (req, res) => {
        try {
            const { id } = req.params;
            await schoolService.deleteSchool(id);
            return successResponse(res, 200, "School deleted successfully");
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message || "Failed to delete school");
        }
    },

    getAllSchools: async (req, res) => {
        try {
            const schools = await schoolService.getAllSchools();
            return successResponse(res, 200, "Schools retrieved successfully", schools);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message || "Failed to retrieve schools");
        }
    },

    getSchoolById: async (req, res) => {
        try {
            const { id } = req.params;
            const school = await schoolService.getSchoolById(id);
            return successResponse(res, 200, "School retrieved successfully", school);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message || "Failed to retrieve school");
        }
    },
};

module.exports = schoolController;
