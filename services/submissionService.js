const submissionRepository = require("../repositories/submissionRepository");
const fileStorageRepository = require("../repositories/fileStorageRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const notificationService = require("../services/notificationService");
const folderHelper = require("../utils/folderHelper");
const { addManyFilesSchema } = require("../validations/fileStorageValidation");
const path = require("path");
const fs = require("fs");
const { throwError } = require("../utils/responseHandler");


const submissionService = {
    createSubmission: async (assignmentIdRaw, currentUser, files) => {
        const assignmentId = Number(assignmentIdRaw);
        const studentId = Number(currentUser.id);

        if (!assignmentId || !studentId) {
            throwError(400, "AssignmentId must be filled in and the user must log in.");
        }

        const assignment = await assignmentRepository.getAssignmentById(assignmentId);
        if (!assignment) throwError(404, "Assignment not found");

        const subjectClass = await submissionRepository.getSubjectClassByAssignmentId(assignmentId);
        if (!subjectClass || !subjectClass.class) throwError(404, "Class or subject not found.");

        const submission = await submissionRepository.createSubmission({
            assignmentId,
            studentId,
        });
        const submissionId = submission.id;

        const schoolId = subjectClass.class.schoolId;
        const classId = subjectClass.class.id;
        const subjectId = subjectClass.subjectId;

        const submissionFolderPath = folderHelper.createSubmissionFolder(
            schoolId, classId, subjectId, submissionId
        );

        if (files && files.length > 0) {
            const fileStorages = files.map((file) => {
                const filePrefix = 'submission_';
                return {
                    userId: studentId,
                    fileName: file.originalname,
                    fileUrl: `${submissionFolderPath}/${filePrefix}${file.filename}`,
                    fileType: "Submission",
                    submissionId: submissionId,
                    assignmentId: assignmentId,
                    uploadDate: new Date(),
                };
            });
            const { error } = addManyFilesSchema.validate(fileStorages);
            if (error) {
                console.error("Validation error:", error.details);
                throwError(400, error.details[0].message);
                return
            }
            await fileStorageRepository.createManyFiles(fileStorages);
        }

        const teacherId = assignment.subjectClass.teacher?.id || null;
        console.log(teacherId);
        if (teacherId) {
            const notificationData = {
                userId: teacherId,
                message: `Students send assignments to"${assignment.title}".`
            };
            await notificationService.sendNotification(notificationData);
        } else {
            console.log("[INFO] Teacher ID is not found, notifications are not sent.");
        }

        return submission;
    },

    getAllSubmissions: async () => {
        const submissions = await submissionRepository.getAllSubmissions();
        return submissions;
    },

    getSubmissionById: async (id) => {
        const submissions = await submissionRepository.getSubmissionById(Number(id));
        if (!submissions) throwError(404, "Submission is not found");
        return {
            message: "Submission retrieved successfully",
            data: submissions
        };
    },

    updateSubmission: async (id, data) => {
        const existingSubmission = await submissionRepository.getSubmissionById(id);
        if (!existingSubmission) throwError(404, "Submission not found");

        if (!existingSubmission.assignment) throwError(404, "Related assignment is not found ");

        const deadline = new Date(existingSubmission.assignment.deadline);
        const now = new Date();
        if (now > deadline) throwError(400, "Cannot update, the deadline has passed");

        return await submissionRepository.updateSubmission(id, data);
    },

    deleteSubmission: async ({ submissionId, userId, userRole }) => {
        const submission = await submissionRepository.getSubmissionById(submissionId);
        if (!submission) throwError(404, "Submission not found");

        const assignmentDeadline = new Date(submission.assignment.deadline);
        const now = new Date();
        const isDeadlinePassed = now > assignmentDeadline;

        if (isDeadlinePassed && userRole !== "Admin") {
            throwError(403, "Only admin can delete submissions after deadlines");
        }
        if (!isDeadlinePassed && userRole !== "Admin" && userRole !== "Teacher") {
            throwError(403, "Only admin or teacher can delete submissions before the deadline");
        }

        if (submission.fileUrl) {
            const filePath = path.join(__dirname, "..", submission.fileUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log("[INFO] The submission file is deleted:", filePath);
            }
        }

        await submissionRepository.deleteSubmission(submissionId);

        return;
    },

};

module.exports = submissionService;
