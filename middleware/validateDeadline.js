// middleware/validateDeadline.js
const fs = require("fs");
const path = require("path");
const { throwError } = require("../utils/responseHandler");
const assignmentRepository = require("../repositories/assignmentRepository");
const { successResponse, errorResponse } = require("../utils/responseHandler")

const validateDeadline = async (req, res, next) => {
    try {
        const assignmentId = Number(req.body.assignmentId);
        if (!assignmentId) throwError(400, "AssignmentId must be provided.");

        const assignment = await assignmentRepository.getAssignmentById(assignmentId);
        if (!assignment) throwError(404, "Assignment not found");

        const currentDateTime = Date.now();
        const assignmentDeadline = assignment.deadline instanceof Date
            ? assignment.deadline.getTime()
            : Date.parse(assignment.deadline);

        if (currentDateTime > assignmentDeadline) {
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    const filePath = path.resolve(file.path);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log(`[DEBUG] File deleted: ${filePath}`);
                    }
                });
            }
            throwError(400, "Submission is not allowed after the deadline.");
        }

        successResponse
    } catch (err) {
        next(err);
    }
};

module.exports = validateDeadline;
