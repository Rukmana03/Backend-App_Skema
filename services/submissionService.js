const submissionRepository = require("../repositories/submissionRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const notificationService = require("../services/notificationService");
const folderHelper = require("../utils/folderHelper");
const fileStorageRepository = require("../repositories/fileStorageRepository");
const path = require("path");
const fs = require("fs");
const { throwError } = require("../utils/responseHandler"); 

const submissionService = {
    createSubmission: async ({ assignmentId, studentId, files }) => {
        console.log("[DEBUG] Membuat submission untuk assignment:", assignmentId, "oleh student:", studentId);

        assignmentId = Number(assignmentId);
        studentId = Number(studentId);

        if (isNaN(assignmentId) || isNaN(studentId)) {
            throwError(400, "assignmentId dan studentId wajib diisi.");
        }

        const assignment = await assignmentRepository.getAssignmentById(assignmentId);
        if (!assignment) throwError(404, "Assignment tidak ditemukan.");

        const subjectClass = await submissionRepository.getSubjectClassByAssignmentId(assignmentId);
        if (!subjectClass || !subjectClass.class) throwError(404, "Class atau Subject tidak ditemukan.");

        const schoolId = subjectClass.class.schoolId;
        const classId = subjectClass.class.id;
        const subjectId = subjectClass.subjectId;

        const submission = await submissionRepository.createSubmission({
            assignmentId,
            studentId,
        });

        const submissionId = submission.id;
        const submissionFolderPath = folderHelper.createSubmissionFolder(
            schoolId, classId, subjectId, assignmentId, submissionId
        );
        console.log("[INFO] Folder penyimpanan submission:", submissionFolderPath);

        if (!files || files.length === 0) {
            throwError(400, "Tidak ada file yang diunggah.");
        }

        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                const finalFilePath = path.join(submissionFolderPath, file.filename);
                try {
                    fs.renameSync(file.path, finalFilePath);
                } catch (err) {
                    console.error("[ERROR] Gagal memindahkan file:", err);
                    throwError(500, "Gagal menyimpan file.");
                }

                const fileUrl = `/${finalFilePath.replace(/\\/g, "/")}`;
                const fileData = {
                    userId: studentId,
                    fileName: file.originalname,
                    fileUrl: fileUrl,
                };

                console.log(`[INFO] Menyimpan file: ${finalFilePath} ke database.`);
                const savedFile = await fileStorageRepository.createFile(fileData);
                await fileStorageRepository.linkFileToSubmission(savedFile.id, submissionId);

                return savedFile;
            })
        );

        console.log("[DEBUG] Semua file berhasil disimpan.");

        await notificationService.sendNotification(
            assignment.teacherId,
            `Siswa mengirim tugas untuk "${assignment.title}".`
        );

        return { submission, files: uploadedFiles };
    },

    getAllSubmissions: async () => {
        const submissions = await submissionRepository.getAllSubmissions();
        return {
            message: "Submissions retrieved successfully",
            data: submissions
        };
    },

    getSubmissionById: async (id) => {
        const submissions = await submissionRepository.getSubmissionById(Number(id));
        if (!submissions) throwError(404, "Submission tidak ditemukan");
        return {
            message: "Submission retrieved successfully",
            data: submissions
        };
    },

    updateSubmission: async (id, data) => {
        const existingSubmission = await submissionRepository.getSubmissionById(id);
        if (!existingSubmission) throwError(404, "Submission tidak ditemukan");

        if (!existingSubmission.assignment) throwError(404, "Assignment terkait tidak ditemukan");

        const deadline = new Date(existingSubmission.assignment.deadline);
        const now = new Date();
        if (now > deadline) throwError(400, "Tidak bisa mengupdate, deadline sudah lewat");

        return await submissionRepository.updateSubmission(id, data);
    },

    getAssignmentById: async (assignmentId) => {
        return await assignmentRepository.getAssignmentById(assignmentId);
    },

    deleteSubmission: async ({ submissionId, userId, userRole }) => {
        console.log("[DEBUG] Service: Menghapus submission");
        console.log("[DEBUG] Submission ID:", submissionId);
        console.log("[DEBUG] User ID:", userId);
        console.log("[DEBUG] Role User:", userRole);

        const submission = await submissionRepository.getSubmissionById(submissionId);
        if (!submission) throwError(404, "Submission tidak ditemukan");

        const assignmentDeadline = new Date(submission.assignment.deadline);
        const now = new Date();
        const isDeadlinePassed = now > assignmentDeadline;

        if (isDeadlinePassed && userRole !== "Admin") {
            throwError(403, "Hanya Admin yang bisa menghapus submission setelah deadline");
        }
        if (!isDeadlinePassed && userRole !== "Admin" && userRole !== "Teacher") {
            throwError(403, "Hanya Admin atau Teacher yang bisa menghapus submission sebelum deadline");
        }

        if (submission.fileUrl) {
            const filePath = path.join(__dirname, "..", submission.fileUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log("[INFO] File submission dihapus:", filePath);
            }
        }

        await submissionRepository.deleteSubmission(submissionId);
        console.log("[INFO] Submission berhasil dihapus.");

        return { message: "Submission berhasil dihapus" };
    },

    submitSubmission: async ({ assignmentId, studentId }) => {
        console.log("[DEBUG] Mulai proses submission...", { assignmentId, studentId });

        assignmentId = Number(assignmentId);
        if (isNaN(assignmentId)) throwError(400, "assignmentId harus berupa angka yang valid.");

        const existingSubmission = await submissionRepository.findSubmissionByStudent(assignmentId, studentId);
        if (!existingSubmission) throwError(404, "Submission belum dibuat. Harap buat submission terlebih dahulu sebelum mengirim.");

        if (!existingSubmission.fileUrl) throwError(400, "Submission harus memiliki file sebelum bisa dikirim.");

        const assignment = await assignmentRepository.getAssignmentById(assignmentId);
        if (!assignment) throwError(404, "Assignment tidak ditemukan.");

        if (!assignment.deadline) throwError(400, "Assignment belum memiliki deadline.");

        const now = new Date();
        const deadlineDate = new Date(assignment.deadline);

        if (isNaN(deadlineDate.getTime())) throwError(400, "Format deadline tidak valid.");

        if (deadlineDate < now) throwError(400, "Deadline sudah lewat, tidak bisa submit.");

        const submission = await submissionRepository.updateSubmissionStatus(existingSubmission.id, "Submitted");

        console.log("[DEBUG] Submission berhasil dikirim:", submission);
        return submission;
    },

};

module.exports = submissionService;
