const path = require("path");
const { throwError } = require("../utils/responseHandler");
const { addFileToAssignmentSchema } = require("../validations/fileStorageValidation");
const fileStorageRepository = require("../repositories/fileStorageRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const submissionRepository = require("../repositories/submissionRepository");
const classRepository = require("../repositories/classRepository"); 
const fs = require("fs");


const fileStorageService = {
    addFilesToAssignment: async (payload) => {
        const { userId, assignmentId, schoolId, classId, subjectId, files } = payload;

        // 🔹 Validasi presence
        if (!assignmentId || !schoolId || !classId || !subjectId) {
            throwError(400, "assignmentId, schoolId, classId, dan subjectId harus disertakan!");
        }

        if (!files || files.length === 0) {
            throwError(400, "Minimal 1 file harus diunggah!");
        }

        // 🔹 Pastikan assignment valid
        const assignment = await assignmentRepository.getAssignmentById(Number(assignmentId));
        if (!assignment) throwError(404, "Assignment tidak ditemukan.");

        // 🔹 Proses semua file
        const savedFiles = [];

        for (const file of files) {
            try {
                const correctFilePath = path.join(
                    `uploads/school-${schoolId}/class-${classId}/subject-${subjectId}/assignment-${assignmentId}`,
                    file.filename
                );

                const fileData = {
                    userId,
                    assignmentId: Number(assignmentId),
                    fileName: file.originalname,
                    fileUrl: correctFilePath,
                };

                // 🔸 Validasi skema file
                const { error } = addFileToAssignmentSchema.validate(fileData);
                if (error) throwError(400, error.details[0].message);

                // 🔸 Simpan file
                const saved = await fileStorageRepository.createFile({
                    userId,
                    fileName: file.originalname,
                    fileUrl: correctFilePath,
                });

                // 🔸 Link ke assignment
                await fileStorageRepository.linkFileToAssignment(saved.id, assignmentId);

                savedFiles.push(saved);
            } catch (err) {
                console.error(`[ERROR] Gagal memproses file ${file.originalname}:`, err.message);
            }
        }

        return savedFiles;
    },

    downloadFile: async (fileId, user) => {
        const file = await fileStorageRepository.getFileById(fileId);
        if (!file) throwError(404, "File tidak ditemukan.");

        let isAuthorized = false;
        let filePath = file.fileUrl;

        // === CASE 1: Assignment File ===
        if (file.AssignmentFile?.assignmentId) {
            const assignment = await assignmentRepository.getAssignmentById(file.AssignmentFile.assignmentId);
            if (!assignment) throwError(404, "Assignment tidak ditemukan.");

            const subjectClass = await classRepository.getSubjectClassById(assignment.subjectClassId);
            if (!subjectClass) throwError(404, "SubjectClass tidak ditemukan.");

            // Teacher pemilik subjectClass
            if (user.role === "Teacher" && subjectClass.teacherId === user.id) {
                isAuthorized = true;
            }

            // Student yang tergabung di class terkait
            if (user.role === "Student") {
                const studentInClass = await classRepository.findStudentInClass(user.id, subjectClass.classId);
                if (studentInClass) isAuthorized = true;
            }
        }

        // === CASE 2: Submission File ===
        else if (file.SubmissionFile?.submissionId) {
            const submission = await submissionRepository.getById(file.SubmissionFile.submissionId);
            if (!submission) throwError(404, "Submission tidak ditemukan.");

            const assignment = await assignmentRepository.getAssignmentById(submission.assignmentId);
            if (!assignment) throwError(404, "Assignment tidak ditemukan.");

            const subjectClass = await classRepository.getSubjectClassById(assignment.subjectClassId);
            if (!subjectClass) throwError(404, "SubjectClass tidak ditemukan.");

            // Student yang mengirim submission
            if (user.role === "Student" && submission.studentId === user.id) {
                isAuthorized = true;
            }

            // Teacher pengampu subjectClass
            if (user.role === "Teacher" && subjectClass.teacherId === user.id) {
                isAuthorized = true;
            }
        }

        // Jika tidak authorized
        if (!isAuthorized) throwError(403, "Kamu tidak punya akses ke file ini.");

        // Cek file fisik
        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) throwError(404, "File fisik tidak ditemukan.");

        return {
            fileName: file.fileName,
            filePath: absolutePath,
        };
    },

    getFilesByAssignment: async (assignmentId) => {
        return await fileStorageRepository.getFilesByAssignment(assignmentId);
    },

    getFilesBySubmission: async (submissionId) => {
        return await fileStorageRepository.getFilesBySubmission(submissionId);
    },

    deleteFile: async (fileId) => {
        const file = await fileStorageRepository.getFileById(fileId);
        if (!file) throwError(404, "File tidak ditemukan.");
        await fileStorageRepository.deleteFile(fileId);
        return { message: "File berhasil dihapus." };
    },
};

module.exports = fileStorageService;
