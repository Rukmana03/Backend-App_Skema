const multer = require("multer");
const path = require("path");
const fs = require("fs");
const folderHelper = require("./folderHelper");
const submissionRepository = require("../repositories/submissionRepository"); // atau path kamu

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            let uploadPath;

            if (req.path.includes("assignment")) {
                const assignmentId = req.params.assignmentId;
                if (!assignmentId) return cb(new Error("assignmentId harus disertakan."));

                // ✅ Ambil data terkait dari DB
                const assignment = await submissionRepository.getAssignmentById(assignmentId);
                if (!assignment || !assignment.subjectClass || !assignment.subjectClass.class) {
                    return cb(new Error("Data assignment tidak lengkap."));
                }

                const schoolId = assignment.subjectClass.class.schoolId;
                const classId = assignment.subjectClass.class.id;
                const subjectId = assignment.subjectClass.subjectId;

                uploadPath = folderHelper.createAssignmentFolder(schoolId, classId, subjectId, assignmentId);
            } else if (req.path.includes("submission")) {
                const submissionId = req.params.submissionId;
                if (!submissionId) return cb(new Error("submissionId harus disertakan."));

                // ✅ Ambil data submission dan assignment terkait
                const submission = await submissionRepository.getSubmissionById(submissionId);
                const assignment = await submissionRepository.getAssignmentById(submission.assignmentId);
                if (!submission || !assignment || !assignment.subjectClass || !assignment.subjectClass.class) {
                    return cb(new Error("Data submission tidak lengkap."));
                }

                const schoolId = assignment.subjectClass.class.schoolId;
                const classId = assignment.subjectClass.class.id;
                const subjectId = assignment.subjectClass.subjectId;
                const assignmentId = assignment.id;

                uploadPath = folderHelper.createSubmissionFolder(schoolId, classId, subjectId, assignmentId, submissionId);
            } else {
                return cb(new Error("Endpoint tidak valid untuk upload."));
            }

            // ✅ Buat folder kalau belum ada
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            console.log("[DEBUG] File akan disimpan di:", uploadPath);
            cb(null, uploadPath);
        } catch (err) {
            cb(err);
        }
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [".pdf", ".doc", ".docx"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Hanya file PDF, DOC, dan DOCX yang diperbolehkan"), false);
        }
    }
});

module.exports = upload;
