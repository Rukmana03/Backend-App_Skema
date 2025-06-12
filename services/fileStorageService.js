const path = require("path");
const { throwError } = require("../utils/responseHandler");
const { addManyFilesSchema } = require("../validations/fileStorageValidation");
const fileStorageRepository = require("../repositories/fileStorageRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const submissionRepository = require("../repositories/submissionRepository");
const folderHelper = require("../utils/folderHelper");
const classRepository = require("../repositories/classRepository");
const fs = require("fs");


const fileStorageService = {
    addFilesToAssignment: async (assignmentIdRaw, currentUser, files) => {
        const assignmentId = Number(assignmentIdRaw);
        const userId = Number(currentUser.id);

        if (!assignmentId || !userId) {
            throwError(400, "AssignmentId must be filled in and the user must log in");
        }

        const assignment = await assignmentRepository.getAssignmentById(assignmentId);
        if (!assignment) throwError(404, "Assignment is not found");

        const subjectClass = await submissionRepository.getSubjectClassByAssignmentId(assignmentId)
        if (!subjectClass || !subjectClass.class) {
            throwError(400, "Class or subject does not exist");
        }

        const classId = subjectClass.class.id;
        const schoolId = subjectClass.class.schoolId;
        const subjectId = subjectClass.subjectId;

        const assignmentFolderPath = folderHelper.createAssignmentFolder(
            schoolId, classId, subjectId,
        );
        console.log("[UPLOAD] Path from createAssignmentFolder:", assignmentFolderPath);
        folderHelper.createFolderIfNotExists(assignmentFolderPath);

        const savedFiles = [];

        if (files && files.length > 0) {
            const fileStorages = files.map((file) => {
                const filePrefix = 'assignment_';
                return {
                    userId: userId,
                    fileName: file.originalname,
                    fileUrl: `${assignmentFolderPath}/${filePrefix}${file.filename}`,
                    fileType: "Assignment",
                    assignmentId: assignmentId,
                    uploadDate: new Date(),
                };
            });
            const { error } = addManyFilesSchema.validate(fileStorages);
            if (error) {
                console.error("Validation error:", error.details);
                throwError(400, error.details[0].message);
            }

            await fileStorageRepository.createManyFiles(fileStorages);
            savedFiles.push(...fileStorages);
        } else {
            throwError(400, "At least 1 file must be uploaded!");
        }

        return savedFiles;
    },

    downloadFile: async (fileId, user) => {
        const file = await fileStorageRepository.getFileById(fileId);
        if (!file) throwError(404, "Files are not found");

        let isAuthorized = false;
        let filePath = file.fileUrl;

        if (file.assignmentId) {
            const assignment = await assignmentRepository.getAssignmentById(file.assignmentId);
            if (!assignment) throwError(404, "Assignment not found.");

            const subjectClass = await classRepository.getSubjectClassById(assignment.subjectClass.id);
            if (!subjectClass) throwError(404, "SubjectClass not found.");

            if (user.role === "Teacher" && subjectClass.teacherId === user.id) { isAuthorized = true; }
            if (user.role === "Student") {
                const studentInClass = await classRepository.findStudentInClass(user.id, subjectClass.classId);
                if (studentInClass) isAuthorized = true;
            }
        }

        else if (file.submissionId) {
            const submission = await submissionRepository.getById(file.file.submissionId);
            if (!submission) throwError(404, "Submission not found.");
            const assignment = await assignmentRepository.getAssignmentById(submission.assignmentId);
            if (!assignment) throwError(404, "Assignment not found.");
            const subjectClass = await classRepository.getSubjectClassById(assignment.subjectClass.id);
            if (!subjectClass) throwError(404, "SubjectClass not found.");

            if (user.role === "Student" && submission.studentId === user.id) { isAuthorized = true; }
            if (user.role === "Teacher" && subjectClass.teacherId === user.id) { isAuthorized = true; }
        }

        if (!isAuthorized) throwError(403, "You don't have access to this file.");

        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) throwError(404, "Physical files are not found.");

        return {
            fileName: file.fileName,
            filePath: absolutePath,
        };
    },

    getFilesByAssignment: async (assignmentId) => {
        const files = await fileStorageRepository.getFilesByAssignment(assignmentId);
        if (!files) throwError(404, "No files found for this assignment.");
        return files;
    },

    getFilesBySubmission: async (submissionId) => {
        const files = await fileStorageRepository.getFilesBySubmission(submissionId);
        if (!files) throwError(404, "No files found for the given submission.");
        return files;
    },

    deleteFile: async (fileId) => {
        const file = await fileStorageRepository.getFileById(fileId);
        if (!file) throwError(404, "File not found.");

        const filePath = path.resolve(file.fileUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        await fileStorageRepository.deleteFile(fileId);
    },
};

module.exports = fileStorageService;
