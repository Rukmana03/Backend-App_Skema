const classRepository = require("../repositories/classRepository");
const studentClassService = require("../services/studentClassService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const studentClassController = {
    addStudentToClass: async (req, res) => {
        try {
            const { classId, studentId, academicYearId } = req.body;

            await studentClassService.addStudentToClass({
                classId: Number(classId),
                studentId: Number(studentId),
                academicYearId: Number(academicYearId),
            });

            return successResponse(res, 200, "Student successfully added to class");
        } catch (error) {
            return errorResponse(res, error.status || 400, error.message);
        }
    },

    deactivateStudentInClass: async (req, res) => {
        try {
            const { classId, studentId } = req.params;
            const result = await studentClassService.deactivateStudentInClass(classId, studentId);
            return successResponse(res, 200, "Student has been deactivated from the class.", result);
        } catch (error) {
            return errorResponse(res, error.status || 400, error.message);
        }
    },

    moveStudentToClass: async (req, res) => {
        try {
            const { studentId, newClassId } = req.body;
            const result = await studentClassService.moveStudent(studentId, newClassId);
            return successResponse(res, 200, "The student has been successfully transferred", result);
        } catch (error) {
            return errorResponse(res, error.status || 400, error.message);
        }
    },

    getActiveStudentsInClass: async (req, res) => {
        try {
            const { id } = req.params;
            const students = await studentClassService.getActiveStudentsInClass(Number(id));
            return successResponse(res, 200, "Data successfully found", students);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message);
        }
    },

    promoteStudentsToClass: async (req, res) => {
        try {
            const { studentIds, newClassId } = req.body;
            if (!studentIds || studentIds.length === 0) {
                return errorResponse(res, 400, "studentIds is required and cannot be empty");
            }
            if(!newClassId){
                return errorResponse(res, 400, "newClassId is required for class promotion");
            }
            const newClass = await classRepository.getClassById(newClassId);
            if (!newClass) {
                return errorResponse(res, 404, "Destination class not found");
            }
            const academicYearId = newClass.academicYearId;
            if (!academicYearId) {
                return errorResponse(res, 400, "academicYearId is required for class promotion");
            }

            const result = await studentClassService.promoteStudentsToClass({
                studentIds,
                newClassId,
                academicYearId,
            });

            return successResponse(res, 200, "Students succeeded in advancing to class", result);
        } catch (error) {
            return errorResponse(res, error.status || 400, error.message);
        }
    },
};

module.exports = studentClassController;
