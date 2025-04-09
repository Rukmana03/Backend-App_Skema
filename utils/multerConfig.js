const multer = require("multer");
const path = require("path");
const folderHelper = require("./folderHelper");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            console.log("[DEBUG] Body request:", req.body); // Tidak akan terbaca di awal
            console.log("[DEBUG] Params request:", req.params);
            console.log("[DEBUG] Query request:", req.query);

            // Ambil ID dari req.params atau req.query, bukan req.body
            const schoolId = req.params.schoolId || req.query.schoolId;
            const classId = req.params.classId || req.query.classId;
            const subjectId = req.params.subjectId || req.query.subjectId;
            const assignmentId = req.params.assignmentId || req.query.assignmentId;
            const submissionId = req.params.submissionId || req.query.submissionId;

            if (!schoolId || !classId || !subjectId) {
                return cb(new Error("schoolId, classId, dan subjectId harus disertakan!"));
            }

            let uploadPath;
            if (req.path.includes("assignment")) {
                if (!assignmentId) return cb(new Error("assignmentId harus disertakan!"));

                uploadPath = folderHelper.createAssignmentFolder(schoolId, classId, subjectId, assignmentId);
                console.log("[DEBUG] Folder Path (assignment):", uploadPath);
            } else if (req.path.includes("submission")) {
                if (!assignmentId || !submissionId) return cb(new Error("assignmentId dan submissionId harus disertakan!"));

                uploadPath = folderHelper.createSubmissionFolder(schoolId, classId, subjectId, assignmentId, submissionId);
                console.log("[DEBUG] Folder Path (submission):", uploadPath);
            } else {
                return cb(new Error("Path penyimpanan tidak valid."));
            }

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
