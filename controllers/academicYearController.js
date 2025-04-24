const { getActiveAcademicYear, getInActiveAcademicYear } = require('../repositories/academicYearRepository');
const academicYearService = require('../services/academicYearService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const academicYearController = {
    createAcademicYear: async (req, res) => {
        try {
            const newYear = await academicYearService.createAcademicYear(req.body);
            return successResponse(res, 201, 'Academic year created successfully', newYear);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    getAllAcademicYears: async (req, res) => {
        try {
            const years = await academicYearService.getAllAcademicYears();
            return successResponse(res, 200, 'All academic years retrieved', years);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    getAcademicYearById: async (req, res) => {
        try {
            const year = await academicYearService.getAcademicYearById(req.params.id);
            return successResponse(res, 200, 'Academic year found', year);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    getActiveAcademicYear: async (req, res) => {
        try{
            const active = await academicYearService.getActiveAcademicYear();
            return successResponse(res, 200, 'Academic year found', active);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    getInActiveAcademicYear: async (req, res) => {
        try{
            const inactive = await academicYearService.getInActiveAcademicYear();
            return successResponse(res, 200, 'Academic year found', inactive);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    updateAcademicYear: async (req, res) => {
        try {
            const updatedYear = await academicYearService.updateAcademicYear(req.params.id, req.body);
            return successResponse(res, 200, 'Academic year updated successfully', updatedYear);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    },

    deleteAcademicYear: async (req, res) => {
        try {
            const deleted = await academicYearService.deleteAcademicYear(req.params.id);
            return successResponse(res, 200, 'Academic year deleted successfully', deleted);
        } catch (error) {
            return errorResponse(res, error.statusCode || 500, error.message);
        }
    }
};

module.exports = academicYearController;
